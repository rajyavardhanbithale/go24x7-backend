import { UUID } from "crypto";

export interface ServiceProviderCategoryCreate {
    name: string;
    parentId?: UUID;
    icon: string;
    isActive?: boolean;
    isInHome?: boolean;
}

export interface ServiceProviderCategory {
    id: UUID;
    name: string;
    parentId?: UUID;
    icon: string;
    isActive: boolean;
    isInHome: boolean;
    createdAt: Date;
    updatedAt: Date;
}