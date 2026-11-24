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
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(50) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `user_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_mdn86t4w3fej4iei71lv79w6f` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (1,'satishrrk1','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYXRpc2hycmtAZ21haWwuY29tIiwiZXhwIjoxNjU4MDU5NTI3LCJyb2xlcyI6InVzZXIiLCJpYXQiOjE2NTU0Njc1Mjd9.ZHb1oB8_kxBv69TZTVzaetIl-6DXK_NXCRsZ1OBbybE','satishrrk@gmail.com'),(2,'canidhi2012','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjYW5pZGhpMjAxMkBnbWFpbC5jb20iLCJleHAiOjE2NDkzMzM0MzAsInJvbGVzIjoidXNlciIsImlhdCI6MTY0Njc0MTQzMH0.6y0E3Hb1nOmTb_nsWxuRqNUomcHHmjhwa9TMsdOS0KE','canidhi2012@gmail.com'),(3,'firojali047','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmaXJvamFsaTA0N0BnbWFpbC5jb20iLCJleHAiOjE2NTgxMjM4MzAsInJvbGVzIjoidXNlciIsImlhdCI6MTY1NTUzMTgzMH0.a_07zXdcc42633vGj-jtPyJVR3UQTYcb6bhlBB0eaH8','firojali047@gmail.com'),(4,'Nipul@1995','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJOaXB1bGt1bWFyOTA0QGdtYWlsLmNvbSIsImV4cCI6MTY1ODExODk0Nywicm9sZXMiOiJ1c2VyIiwiaWF0IjoxNjU1NTI2OTQ3fQ.aMeRoPz38bT56Dji5PILlHflsAwoKo0j9T88Q9Mw47Y','Nipulkumar904@gmail.com'),(5,'vaseem31330','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2YXNlZW0zMTMzMEBnbWFpbC5jb20iLCJleHAiOjE2NTcyNjYyMzMsInJvbGVzIjoidXNlciIsImlhdCI6MTY1NDY3NDIzM30.iAYttK4SFqiawhN09FA_HIRgrZlLz9goWrGj9XGeVRE','vaseem31330@gmail.com'),(6,'swativerma8895','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJTV0FUSVZFUk1BODg5NUBnbWFpbC5jb20iLCJleHAiOjE2NTc4ODA5MDAsInJvbGVzIjoidXNlciIsImlhdCI6MTY1NTI4ODkwMH0.IghdisM2Cf94RSZVUreGapm7vnN5Y4CSmHe_1i2AqEM','SWATIVERMA8895@gmail.com'),(7,'bobbynegi2012',NULL,'bobbynegi2012@gmail.com'),(8,'ruchi1',NULL,'ruhek2010@gmail.com'),(9,'parulvsc1','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYXNoaWJoYXJkd2FqMTcwOUBnbWFpbC5jb20iLCJleHAiOjE2NDIzMTg0NDksInJvbGVzIjoidXNlciIsImlhdCI6MTYzOTcyNjQ0OX0.TJc9eLf_gnF3PrnpbSPfnGf1mQOkdr-wuZzgKhErg4o','rashibhardwaj1709@gmail.com'),(10,'adityagupta410','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJndXB0YWFkaXR5YTQxMEBnbWFpbC5jb20iLCJleHAiOjE2NTcxMTE1OTksInJvbGVzIjoidXNlciIsImlhdCI6MTY1NDUxOTU5OX0.cr-J11zHm0MYZqBs37z6l_HXU1ZhBaLW707NGJpQWxg','guptaaditya410@gmail.com'),(11,'negichandi4','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZWdpY2hhbmRpNEBnbWFpbC5jb20iLCJleHAiOjE2NTgwMzIyNjYsInJvbGVzIjoidXNlciIsImlhdCI6MTY1NTQ0MDI2Nn0.p0_CZvROWThKgEuA1XIJcoycjAjdXNgAAPW8DmVBV30','negichandi4@gmail.com'),(12,'aayushirahtan','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYXl1c2hpcmFodGFuQGdtYWlsLmNvbSIsImV4cCI6MTY1Nzc3OTU1Nywicm9sZXMiOiJ1c2VyIiwiaWF0IjoxNjU1MTg3NTU3fQ.69rLz92hyu0IbGAXHdCLwtplOrZmfbDfEhW9nO23ydc','aayushirahtan@gmail.com'),(13,'Vscca123',NULL,'NA@gmail.com'),(14,'Vscca123',NULL,'testuser@gmail.com'),(15,'hemanthkaushik06',NULL,'hemanthkaushik06@gmail.com'),(16,'vsajwan323',NULL,'vsajwan323@gmail.com');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
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
