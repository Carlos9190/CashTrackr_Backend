import { createRequest, createResponse } from "node-mocks-http"
import { AuthController } from "../../../controllers/AuthController"
import User from "../../../models/User"
import { checkPassword, hashPassword } from "../../../utils/auth"
import { generateToken } from "../../../utils/token"
import { AuthEmail } from "../../../emails/AuthEmail"
import { generateJWT } from "../../../utils/jwt"

jest.mock('../../../models/User')
jest.mock('../../../utils/auth')
jest.mock('../../../utils/token')
jest.mock('../../../utils/jwt')

describe('Authcontroller.createAccount', () => {
    it('should return a 409 status and an error message if the email is already registered', async () => {

        (User.findOne as jest.Mock).mockResolvedValueOnce(true)
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: {
                email: "test@test.com",
                password: "testpassword"
            }
        })
        const res = createResponse()

        await AuthController.createAccount(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(409)
        expect(data).toHaveProperty('error', 'Un usuario con ese e-mail ya está registrado')
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)
    })

    it('should register a new user and return a success result', async () => {
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: {
                email: "test@test.com",
                password: "testpassword",
                name: "testname"
            }
        })
        const res = createResponse();

        const mockUser = { ...req.body, save: jest.fn() };

        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (hashPassword as jest.Mock).mockResolvedValue('hashedpassword');
        (generateToken as jest.Mock).mockReturnValue('123456');
        jest.spyOn(AuthEmail, 'sendConfirmationEmail').mockImplementation(() => Promise.resolve());

        await AuthController.createAccount(req, res)

        expect(User.create).toHaveBeenCalledWith(req.body)
        expect(User.create).toHaveBeenCalledTimes(1)
        expect(mockUser.save).toHaveBeenCalled()
        expect(mockUser.password).toBe('hashedpassword')
        expect(mockUser.token).toBe('123456')
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            token: '123456'
        })
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
        expect(res.statusCode).toBe(201)

    })
})

describe('Authcontroller.login', () => {
    it('should return 404 if user is not found', async () => {
        (User.findOne as jest.Mock).mockResolvedValueOnce(null)
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: "test@test.com",
                password: "testpassword"
            }
        })
        const res = createResponse()

        await AuthController.login(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(404)
        expect(data).toEqual({ error: 'Usuario no encontrado' })
    })

    it('should return 403 if the account has not been confirm', async () => {
        (User.findOne as jest.Mock).mockResolvedValueOnce({
            id: 1,
            email: "test@test.com",
            password: "testpassword",
            confirmed: false
        })

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: "test@test.com",
                password: "testpassword"
            }
        })
        const res = createResponse()

        await AuthController.login(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(403)
        expect(data).toEqual({ error: 'La cuenta no ha sido confirmada' })
    })

    it('should return 401 if the password is incorrect', async () => {
        const userMock = {
            id: 1,
            email: "test@test.com",
            password: "testpassword",
            confirmed: true
        };
        (User.findOne as jest.Mock).mockResolvedValueOnce(userMock);

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: "test@test.com",
                password: "testpassword2"
            }
        })
        const res = createResponse();

        (checkPassword as jest.Mock).mockResolvedValue(false)

        await AuthController.login(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(401)
        expect(data).toEqual({ error: 'Password incorrecto' })
        expect(checkPassword).toHaveBeenCalledWith(req.body.password, userMock.password)
        expect(checkPassword).toHaveBeenCalledTimes(1)
    })

    it('should return a JWT if authentication is successful', async () => {
        const userMock = {
            id: 1,
            email: "test@test.com",
            password: "testpassword",
            confirmed: true
        };

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: "test@test.com",
                password: "testpassword"
            }
        })
        const res = createResponse();

        const fakeJWT = 'fake_jwt';

        (User.findOne as jest.Mock).mockResolvedValueOnce(userMock);
        (checkPassword as jest.Mock).mockResolvedValue(true);
        (generateJWT as jest.Mock).mockReturnValue(fakeJWT);

        await AuthController.login(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toEqual(fakeJWT)
        expect(generateJWT).toHaveBeenCalledTimes(1)
        expect(generateJWT).toHaveBeenCalledWith(userMock.id)

    })
})