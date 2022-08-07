CREATE DATABASE  IF NOT EXISTS `vscca` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vscca`;
-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: vscca
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user_details`
--

DROP TABLE IF EXISTS `user_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `access_type` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `about_me` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `consulting` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  `execution` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `intimation` varchar(255) DEFAULT NULL,
  `is_active` int DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `mobile_number` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `responsibility` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_details`
--

LOCK TABLES `user_details` WRITE;
/*!40000 ALTER TABLE `user_details` DISABLE KEYS */;
INSERT INTO `user_details` VALUES (1,'Admin','Roorkee',NULL,'Roorkee','Roorkee','1','India','satishrrk@gmail.com','1','Satish','1',1,'Sharma',NULL,NULL,'1'),(2,'Supervisor','Roorkee',NULL,'Roorkee','Roorkee','1','India','canidhi2012@gmail.com','1','Nidhi','1',1,'Saini',NULL,NULL,'1'),(3,'Supervisor','Roorkee',NULL,'Roorkee','Roorkee','1','India','firojali047@gmail.com','1','Firoj','1',1,'Ali',NULL,NULL,'1'),(4,'Supervisor','Roorkee',NULL,'Roorkee','Roorkee','0','India','Nipulkumar904@gmail.com','1','Nipul','0',1,'Kumar',NULL,NULL,'1'),(5,'TeamMember','Roorkee',NULL,'Roorkee','Roorkee','0','India','vaseem31330@gmail.com','1','Rao','0',1,'Vaseem',NULL,NULL,'1'),(6,'TeamMember','Roorkee',NULL,'Roorkee','Roorkee','0','India','SWATIVERMA8895@gmail.com','1','Swati','0',1,'Verma',NULL,NULL,'1'),(7,'TeamMember','Roorkee',NULL,'Roorkee','Roorkee','0','India','bobbynegi2012@gmail.com','1','Bobby','0',1,'Sharma',NULL,NULL,'1'),(8,'TeamMember','Roorkee',NULL,'Roorkee','Roorkee','0','India','ruhek2010@gmail.com','1','Ruchi','0',1,'Agarwal',NULL,NULL,'1'),(9,'TeamMember','Roorkee',NULL,'Roorkee','Roorkee','0','India','rashibhardwaj1709@gmail.com','1','Parul','0',1,'VSC',NULL,NULL,'1'),(10,'TeamMember','Roorkee',NULL,'Roorkee','Roorkee','0','India','guptaaditya410@gmail.com','1','Aditya','0',1,'Gupta',NULL,NULL,'1'),(11,'TeamMember','Roorkee',NULL,'Roorkee','Roorkee','0','India','negichandi4@gmail.com','1','Chandani','0',1,'Negi',NULL,NULL,'1'),(12,'TeamMember','Roorkee',NULL,'Roorkee','Roorkee','0','India','aayushirahtan@gmail.com','1','Aayushi','0',1,'Chaudhary',NULL,NULL,'1'),(13,'TeamMember','Roorkee','NA','Roorkee','Roorkee','1','India','NA@gmail.com','1','N','1',1,'A','0000000000','000000','1'),(14,'TeamMember','Roorkee','','','','1','','testuser@gmail.com','1','test','1',0,'user','','','0'),(15,'TeamMember','Roorkee','','Roorkee','Roorkee','0','','hemanthkaushik06@gmail.com','1','Hemant ','0',1,'Kaushik','9536305978','247667','1'),(16,'TeamMember','Roorkee','vivek','roorkee','roorkee','0','Inida','vsajwan323@gmail.com','1','Vivek','0',1,'Singh','7895194714','247667','1');
/*!40000 ALTER TABLE `user_details` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-18 23:30:19
