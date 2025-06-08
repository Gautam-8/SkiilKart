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
exports.Thread = void 0;
const typeorm_1 = require("typeorm");
let Thread = class Thread {
    id;
    roadmapId;
    stepId;
    title;
    userId;
    user;
    roadmap;
    step;
    comments;
    createdAt;
    updatedAt;
};
exports.Thread = Thread;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Thread.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Thread.prototype, "roadmapId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Thread.prototype, "stepId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Thread.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Thread.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', 'threads'),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", Object)
], Thread.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Roadmap', 'threads'),
    (0, typeorm_1.JoinColumn)({ name: 'roadmapId' }),
    __metadata("design:type", Object)
], Thread.prototype, "roadmap", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('RoadmapStep', 'threads', { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'stepId' }),
    __metadata("design:type", Object)
], Thread.prototype, "step", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Comment', 'thread'),
    __metadata("design:type", Array)
], Thread.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Thread.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Thread.prototype, "updatedAt", void 0);
exports.Thread = Thread = __decorate([
    (0, typeorm_1.Entity)('threads')
], Thread);
//# sourceMappingURL=thread.entity.js.map