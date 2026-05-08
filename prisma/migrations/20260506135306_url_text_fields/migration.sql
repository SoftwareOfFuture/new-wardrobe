-- AlterTable
ALTER TABLE `media` MODIFY `url` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `model3d` MODIFY `sourceImageUrl` TEXT NOT NULL,
    MODIFY `modelUrl` TEXT NULL,
    MODIFY `thumbnailUrl` TEXT NULL;

-- AlterTable
ALTER TABLE `productimage` MODIFY `url` TEXT NOT NULL;
