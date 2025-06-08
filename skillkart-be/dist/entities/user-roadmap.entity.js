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
exports.UserRoadmap = void 0;
const typeorm_1 = require("typeorm");
let UserRoadmap = class UserRoadmap {
    id;
    userId;
    roadmapId;
    startedAt;
    user;
    roadmap;
    progress;
    createdAt;
    updatedAt;
};
exports.UserRoadmap = UserRoadmap;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserRoadmap.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserRoadmap.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserRoadmap.prototype, "roadmapId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], UserRoadmap.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', 'userRoadmaps'),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", Object)
], UserRoadmap.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Roadmap', 'userRoadmaps'),
    (0, typeorm_1.JoinColumn)({ name: 'roadmapId' }),
    __metadata("design:type", Object)
], UserRoadmap.prototype, "roadmap", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('UserRoadmapProgress', 'userRoadmap'),
    __metadata("design:type", Array)
], UserRoadmap.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserRoadmap.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserRoadmap.prototype, "updatedAt", void 0);
exports.UserRoadmap = UserRoadmap = __decorate([
    (0, typeorm_1.Entity)('user_roadmaps')
], UserRoadmap);
//# sourceMappingURL=user-roadmap.entity.js.map