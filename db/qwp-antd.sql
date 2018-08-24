-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: antd
-- ------------------------------------------------------
-- Server version	5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `tb_books` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(256) NULL,
  `tags` TEXT NULL,
  `description` TEXT NULL,
  `create_time` INT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index_name` (`name` ASC),
  INDEX `Index_create_time` (`create_time` ASC)
);
  
--
-- Table structure for table `sys_modules`
--

DROP TABLE IF EXISTS `sys_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_modules` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `path` text NOT NULL,
  `description` text,
  `type` enum('m','p','op') NOT NULL DEFAULT 'm',
  `seq` int(11) DEFAULT '1',
  `enabled` enum('y','n') NOT NULL DEFAULT 'y',
  `name` text NOT NULL,
  `public` enum('y','n') DEFAULT 'n',
  `icon` varchar(128) DEFAULT NULL,
  `page` enum('y','n') DEFAULT 'y',
  PRIMARY KEY (`id`),
  KEY `Index_op` (`type`),
  KEY `Index_seq` (`seq`),
  KEY `Index_enabled` (`enabled`),
  KEY `Index_nav_menu` (`page`),
  KEY `Index_public` (`public`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_modules`
--

LOCK TABLES `sys_modules` WRITE;
/*!40000 ALTER TABLE `sys_modules` DISABLE KEYS */;
INSERT INTO `sys_modules` VALUES (59,'/sample',NULL,'m',1,'y','sample','y','bars','n'),(60,'/sample/dashboard',NULL,'m',1,'y','dashboard','n','dashboard','n'),(61,'/sample/exception',NULL,'m',1,'y','exception','y','warning','n'),(62,'/sample/form',NULL,'m',1,'y','form','n','form','n'),(63,'/sample/form/step-form',NULL,'m',1,'y','step-form','n','','n'),(64,'/sample/list',NULL,'m',1,'y','list','n','table','n'),(65,'/sample/list/search',NULL,'m',1,'y','search','n','','n'),(66,'/sample/profile',NULL,'m',1,'y','profile','n','profile','n'),(67,'/sample/result',NULL,'m',1,'y','result','n','check-circle-o','n'),(68,'/system',NULL,'m',1,'y','system','n','','n'),(69,'/system/settings',NULL,'m',1,'y','settings','n','setting','n'),(70,'/system/user',NULL,'m',1,'y','user','n','','n'),(71,'/portal',NULL,'m',1,'y','portal','n','','n'),(72,'/sample/dashboard/workplace',NULL,'m',1,'y','workplace','n','','n'),(73,'/sample/dashboard/monitor',NULL,'m',1,'y','monitor','n','','n'),(74,'/sample/exception/403',NULL,'m',1,'y','403','y','exception','n'),(75,'/sample/exception/404',NULL,'m',1,'y','404','y','','n'),(76,'/sample/exception/500',NULL,'m',1,'y','500','y','','n'),(77,'/sample/form/basic-form',NULL,'m',1,'y','basic-form','n','','n'),(78,'/sample/form/advanced-form',NULL,'m',1,'y','advanced-form','n','','n'),(79,'/sample/form/step-form/info',NULL,'m',1,'y','info','n','','y'),(80,'/sample/form/step-form/confirm',NULL,'m',1,'y','confirm','n','','y'),(81,'/sample/form/step-form/result',NULL,'m',1,'y','result','n','','y'),(82,'/sample/list/table',NULL,'m',1,'y','table','n','','n'),(83,'/sample/list/basic',NULL,'m',1,'y','basic','n','','n'),(84,'/sample/list/card',NULL,'m',1,'y','card','n','','n'),(85,'/sample/list/search/applications',NULL,'m',1,'y','applications','n','','n'),(86,'/sample/list/search/articles',NULL,'m',1,'y','articles','n','','n'),(87,'/sample/list/search/projects',NULL,'m',1,'y','projects','n','','n'),(88,'/sample/profile/advanced',NULL,'m',1,'y','advanced','n','','n'),(89,'/sample/profile/basic',NULL,'m',1,'y','basic','n','','n'),(90,'/sample/result/fail',NULL,'m',1,'y','fail','n','','n'),(91,'/sample/result/success',NULL,'m',1,'y','success','n','','n'),(92,'/system/settings/basic',NULL,'m',1,'y','basic','n','','n'),(93,'/system/settings/features',NULL,'m',1,'y','features','n','','n'),(94,'/system/user/users',NULL,'m',1,'y','users','n','user','n'),(95,'/system/user/role',NULL,'m',1,'y','role','n','','n'),(96,'/system/user/create',NULL,'op',1,'y','create','n','','n'),(97,'/system/user/del',NULL,'op',1,'y','del','n','','n'),(98,'/system/user/edit',NULL,'op',1,'y','edit','n','','n'),(99,'/system/user/list',NULL,'op',1,'y','list','n','','n'),(100,'/sample/exception/list',NULL,'op',1,'y','list','y','','n'),(101,'/system/settings/create_settings',NULL,'op',1,'y','create_settings','n','','n'),(102,'/system/settings/del_settings',NULL,'op',1,'y','del_settings','n','','n'),(103,'/system/settings/list_settings',NULL,'op',1,'y','list_settings','n','','n'),(104,'/system/settings/save_settings',NULL,'op',1,'y','save_settings','n','','n'),(105,'/system/settings/update_settings',NULL,'op',1,'y','update_settings','n','','n'),(106,'/system/user/upload_avatar',NULL,'op',1,'y','upload_avatar','n','','n');
/*!40000 ALTER TABLE `sys_modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_role`
--

DROP TABLE IF EXISTS `sys_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_role` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Index_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role`
--

LOCK TABLES `sys_role` WRITE;
/*!40000 ALTER TABLE `sys_role` DISABLE KEYS */;
INSERT INTO `sys_role` VALUES (1,'Admin','Admin'),(2,'Maintainer','Maintainer');
/*!40000 ALTER TABLE `sys_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_role_modules`
--

DROP TABLE IF EXISTS `sys_role_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_role_modules` (
  `module_id` int(10) unsigned DEFAULT NULL,
  `role_id` int(10) unsigned DEFAULT NULL,
  UNIQUE KEY `Index_unique` (`module_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role_modules`
--

LOCK TABLES `sys_role_modules` WRITE;
/*!40000 ALTER TABLE `sys_role_modules` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_role_modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_user`
--

DROP TABLE IF EXISTS `sys_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account` varchar(32) NOT NULL,
  `pwd` varchar(48) NOT NULL,
  `role` int(3) NOT NULL DEFAULT '1',
  `other_role` int(10) DEFAULT NULL,
  `create_time` int(10) DEFAULT NULL,
  `last_login_time` int(10) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `status` enum('ok','lock','disable','del') NOT NULL DEFAULT 'ok',
  `first_login` enum('y','n') NOT NULL DEFAULT 'y',
  `del_time` int(10) unsigned NOT NULL DEFAULT '0',
  `phone` varchar(16) DEFAULT NULL,
  `online` enum('y','n') NOT NULL DEFAULT 'n',
  `last_heartbit_time` int(10) unsigned NOT NULL DEFAULT '0',
  `parent` varchar(255) NOT NULL DEFAULT '0',
  `level` enum('1','2','3') NOT NULL DEFAULT '1',
  `email` text NOT NULL,
  `address` text,
  `age` int(10) unsigned DEFAULT NULL,
  `gender` enum('f','m','u') DEFAULT 'u',
  `nick_name` varchar(128) DEFAULT NULL,
  `avatar` text,
  `avatar_type` varchar(128) DEFAULT NULL,
  `editable` ENUM('y', 'n') NULL DEFAULT 'y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index_account_unique` (`account`) USING BTREE,
  KEY `Index_pwd` (`pwd`),
  KEY `Index_role` (`role`),
  KEY `Index_create_time` (`create_time`),
  KEY `Index_last_login_time` (`last_login_time`),
  KEY `Index_name` (`name`),
  KEY `Index_status` (`status`),
  KEY `Index_first_login` (`first_login`),
  KEY `Index_del_time` (`del_time`),
  KEY `Index_online` (`online`),
  KEY `Index_last_heartbit_time` (`last_heartbit_time`),
  KEY `Index_level` (`level`),
  KEY `Index_parent` (`parent`),
  KEY `Index_nick_name` (`nick_name`),
  KEY `Index_editable` (`editable`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_user`
--

LOCK TABLES `sys_user` WRITE;
/*!40000 ALTER TABLE `sys_user` DISABLE KEYS */;
INSERT INTO `sys_user` VALUES (1,'admin','7946e795e44db67be4c74219def41e2e',1,NULL,1361171257,1421893162,'Admin','ok','n',0,NULL,'y',1421893162,'','1','0',NULL,NULL,'u',NULL,NULL,NULL,'n');
/*!40000 ALTER TABLE `sys_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-11 22:59:29
