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
exports.Roadmap = void 0;
const typeorm_1 = require("typeorm");
let Roadmap = class Roadmap {
    id;
    title;
    skillCategory;
    description;
    totalWeeks;
    steps;
    userRoadmaps;
    threads;
    createdAt;
    updatedAt;
};
exports.Roadmap = Roadmap;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Roadmap.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Roadmap.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Roadmap.prototype, "skillCategory", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Roadmap.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Roadmap.prototype, "totalWeeks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('RoadmapStep', 'roadmap'),
    __metadata("design:type", Array)
], Roadmap.prototype, "steps", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('UserRoadmap', 'roadmap'),
    __metadata("design:type", Array)
], Roadmap.prototype, "userRoadmaps", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Thread', 'roadmap'),
    __metadata("design:type", Array)
], Roadmap.prototype, "threads", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Roadmap.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Roadmap.prototype, "updatedAt", void 0);
exports.Roadmap = Roadmap = __decorate([
    (0, typeorm_1.Entity)('roadmaps')
], Roadmap);
//# sourceMappingURL=roadmap.entity.js.map