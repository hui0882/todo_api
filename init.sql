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
  `created_at`  DATETIME(3)      NOT NULL                 COMMENT '创建时间',
  `updated_at`  DATETIME(3)      NOT NULL                 COMMENT '最后更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_todos_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='待办事项表';
