"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
let User = class User {
    constructor() {
        this.email = '';
        this.rol = '';
        this.contrasenya = '';
        this.nombre_usuario = '';
        this.descripcion = '';
        this.rango = 0;
        this.experiencia = 0;
        this.foto_perfil = '';
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "contrasenya", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 15, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "nombre_usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", nullable: false }),
    __metadata("design:type", Number)
], User.prototype, "rango", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", nullable: false }),
    __metadata("design:type", Number)
], User.prototype, "experiencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "foto_perfil", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
