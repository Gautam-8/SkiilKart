"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const thread_entity_1 = require("../entities/thread.entity");
const comment_entity_1 = require("../entities/comment.entity");
const roadmap_entity_1 = require("../entities/roadmap.entity");
const roadmap_step_entity_1 = require("../entities/roadmap-step.entity");
const threads_service_1 = require("./threads.service");
const threads_controller_1 = require("./threads.controller");
const auth_module_1 = require("../auth/auth.module");
let ThreadsModule = class ThreadsModule {
};
exports.ThreadsModule = ThreadsModule;
exports.ThreadsModule = ThreadsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([thread_entity_1.Thread, comment_entity_1.Comment, roadmap_entity_1.Roadmap, roadmap_step_entity_1.RoadmapStep]),
            auth_module_1.AuthModule,
        ],
        controllers: [threads_controller_1.ThreadsController],
        providers: [threads_service_1.ThreadsService],
        exports: [threads_service_1.ThreadsService],
    })
], ThreadsModule);
//# sourceMappingURL=threads.module.js.map