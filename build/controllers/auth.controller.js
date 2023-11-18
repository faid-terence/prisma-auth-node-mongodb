"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const generateToken_1 = require("../services/generateToken");
const prisma = new client_1.PrismaClient();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Invalid Inputs" });
        }
        const existUser = yield prisma.user.findFirst({ where: { email: email } });
        if (existUser) {
            return res.status(409).json({ message: "User Already Exists" });
        }
        const salt = yield bcrypt.genSalt(10);
        const hashPassword = yield bcrypt.hash(password, salt);
        const user = yield prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
            },
        });
        return res.status(201).json({ message: "User Created Successful", user });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.registerUser = registerUser;
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Invalid Inputs" });
        }
        const existUser = yield prisma.user.findFirst({ where: { email: email } });
        if (!existUser) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const passwordExist = yield bcrypt.compare(password, existUser.password);
        if (!passwordExist) {
            return res.status(401).json({ message: "Invalid Password" });
        }
        const token = (0, generateToken_1.generateToken)(existUser);
        res.status(200).json({ message: "Login Successful", token });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.LoginUser = LoginUser;
