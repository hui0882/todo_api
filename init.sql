-- ============================================================
-- TODO API 数据库初始化脚本
-- 数据库：todo_list_api
-- 字符集：utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS `todo_list_api`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `todo_list_api`;

-- ------------------------------------------------------------
-- 用户表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT '用户唯一ID',
  `username`      VARCHAR(50)      NOT NULL                COMMENT '用户名（用于登录）',
  `password_hash` VARCHAR(255)     NOT NULL                COMMENT '密码哈希值（bcrypt加密后）',
  `email`         VARCHAR(100)     DEFAULT NULL            COMMENT '邮箱（可选）',
  `created_at`    DATETIME(3)      NOT NULL                COMMENT '账号创建时间',
  `updated_at`    DATETIME(3)      NOT NULL                COMMENT '最后更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email`    (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ------------------------------------------------------------
-- 待办分类表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id`          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT  COMMENT '分类唯一ID',
  `user_id`     BIGINT UNSIGNED  NOT NULL DEFAULT 0       COMMENT '所属用户ID（0=系统预置，对所有用户可见）',
  `name`        VARCHAR(50)      NOT NULL                 COMMENT '分类名称',
  `color`       VARCHAR(20)      NOT NULL DEFAULT '#1677ff' COMMENT '颜色（十六进制）',
  `icon`        VARCHAR(50)      DEFAULT NULL             COMMENT 'Ant Design图标名',
  `sort_order`  INT              NOT NULL DEFAULT 0       COMMENT '排序权重，越小越靠前',
  `is_preset`   TINYINT(1)       NOT NULL DEFAULT 0       COMMENT '是否预置（不可被用户删改）',
  `created_at`  DATETIME(3)      NOT NULL                 COMMENT '创建时间',
  `updated_at`  DATETIME(3)      NOT NULL                 COMMENT '最后更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='待办分类表';

-- ------------------------------------------------------------
-- 待办事项表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `todos` (
  `id`          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT  COMMENT '待办事项唯一ID',
  `user_id`     BIGINT UNSIGNED  NOT NULL                 COMMENT '所属用户ID',
  `title`       VARCHAR(255)     NOT NULL                 COMMENT '待办事项标题',
  `description` TEXT             DEFAULT NULL             COMMENT '详细描述',
  `status`      TINYINT          NOT NULL DEFAULT 0       COMMENT '状态：0=未完成，1=已完成',
  `priority`    TINYINT          NOT NULL DEFAULT 0       COMMENT '优先级：0=普通，1=重要，2=紧急',
  `due_date`    DATETIME(3)      DEFAULT NULL             COMMENT '截止日期',
  `category_id` BIGINT UNSIGNED  DEFAULT NULL             COMMENT '所属分类ID，NULL=未分类',
  `remind_at`   DATETIME(3)      DEFAULT NULL             COMMENT '提醒时间',
  `created_at`  DATETIME(3)      NOT NULL                 COMMENT '创建时间',
  `updated_at`  DATETIME(3)      NOT NULL                 COMMENT '最后更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_category_id` (`category_id`),
  CONSTRAINT `fk_todos_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_todos_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='待办事项表';

-- ------------------------------------------------------------
-- 预置分类种子数据
-- ------------------------------------------------------------
INSERT IGNORE INTO `categories` (`id`,`user_id`,`name`,`color`,`icon`,`sort_order`,`is_preset`,`created_at`,`updated_at`) VALUES
(1, 0, '工作', '#1677ff', 'LaptopOutlined',  1, 1, NOW(3), NOW(3)),
(2, 0, '学习', '#52c41a', 'ReadOutlined',    2, 1, NOW(3), NOW(3)),
(3, 0, '生活', '#fa8c16', 'HomeOutlined',    3, 1, NOW(3), NOW(3)),
(4, 0, '健康', '#eb2f96', 'HeartOutlined',   4, 1, NOW(3), NOW(3)),
(5, 0, '其他', '#8c8c8c', 'TagOutlined',     5, 1, NOW(3), NOW(3));
