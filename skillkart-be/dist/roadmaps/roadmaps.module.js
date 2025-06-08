"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const roadmap_entity_1 = require("../entities/roadmap.entity");
const roadmap_step_entity_1 = require("../entities/roadmap-step.entity");
const user_roadmap_entity_1 = require("../entities/user-roadmap.entity");
const user_roadmap_progress_entity_1 = require("../entities/user-roadmap-progress.entity");
const roadmaps_service_1 = require("./roadmaps.service");
const roadmaps_controller_1 = require("./roadmaps.controller");
const auth_module_1 = require("../auth/auth.module");
const gamification_module_1 = require("../gamification/gamification.module");
let RoadmapsModule = class RoadmapsModule {
};
exports.RoadmapsModule = RoadmapsModule;
exports.RoadmapsModule = RoadmapsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                roadmap_entity_1.Roadmap,
                roadmap_step_entity_1.RoadmapStep,
                user_roadmap_entity_1.UserRoadmap,
                user_roadmap_progress_entity_1.UserRoadmapProgress,
            ]),
            auth_module_1.AuthModule,
            (0, common_1.forwardRef)(() => gamification_module_1.GamificationModule),
        ],
        controllers: [roadmaps_controller_1.RoadmapsController],
        providers: [roadmaps_service_1.RoadmapsService],
        exports: [roadmaps_service_1.RoadmapsService],
    })
], RoadmapsModule);
//# sourceMappingURL=roadmaps.module.js.map