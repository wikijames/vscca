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
-- Table structure for table `billing_client`
--

DROP TABLE IF EXISTS `billing_client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billing_client` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client` varchar(255) DEFAULT NULL,
  `is_active` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billing_client`
--

LOCK TABLES `billing_client` WRITE;
/*!40000 ALTER TABLE `billing_client` DISABLE KEYS */;
INSERT INTO `billing_client` VALUES (1,'Amar Gupta-L3-402 ','1'),(2,'Atul Pundir Globalmart Trading-L3-187','1'),(3,'Adv Asheesh-L3-428','1'),(4,'Ajay Jain Maglam Sales Agency-L3-260','1'),(5,'Ajay Kumar Pandy Infratest-L3-345','1'),(6,'Advocate Ravikant-L3-325','1'),(7,'Arun Tyagi Arvikaa Agro Products-L3-420','1'),(8,'Advocate Vinod Garg-L3-316','1'),(9,'Advocate Surendra Kumar-L3-311','1'),(10,'Advocate Shivam Jindal-L3-59','1'),(11,'Arvindam Trust-L3-175','1'),(12,'Advocate Deepak Vaishy-L3-351','1'),(13,'Babu Jagjivan and Sarvjan Kalyan-L3-356','1'),(14,'CHSARET-L3-409','1'),(15,'City Montesary-L3-209','1'),(16,'Arihant Traders ARVN Dhiraj Tyagi-L3-231','1'),(17,'Dr. Alok Kumar-L3-469','1'),(18,'Dr. Nirbhaya Singh-L3-371','1'),(19,'Dinesh Kaushik 3D Construction-L3-205','1'),(20,'Himanshu Walia-L3-197','1'),(21,'Hardik Sewa Sansthan -L3-214','1'),(22,'Hello India-L3-425','1'),(23,'Kuldeep Mittal-L3-7','1'),(24,'Kamil Ji National and Sultanpur Society-L3-360','1'),(25,'Kapil Sharma Desire Tour Travels-L3-476','1'),(26,'Kuldeep Anubhuti Holidays Private Limited-L3-29','1'),(27,'Kuldeep Fine Packaging-L3-269','1'),(28,'Kuldeep Chem Tech-L3-265','1'),(29,'Keshav Maheshwari UGS Upper Ganges-L3-274','1'),(30,'Kush Agarwal-L3-367','1'),(31,'Adv Lokesh-L3-236','1'),(32,'MH Packaging Parvej Alam-L3-406','1'),(33,'Moosami Hazara-L3-333','1'),(34,'Neelkanth Print & Packers Devesh-L3-376','1'),(35,'Nihali Polychem-L3-248','1'),(36,'Nishant Bhardwaj Creative and Nishant Industries-L3-128','1'),(37,'Naveen Rajput Shri Rudra Enterprises-L3-287','1'),(38,'Nivesh Salahakar Private Limited Gaurav Giri-L3-19','1'),(39,'Naveen Bansal-L3-220','1'),(40,'Nanda Gaur-L3-483','1'),(41,'Rishi Chaurasia-L3-341','1'),(42,'Raj Kumar Pahuja-L3-489','1'),(43,'Roorkee X-Ray Dr Ajay Saxena-L3-417','1'),(44,'Ranjana-L3-330','1'),(45,'Raghu Dev-L3-2','1'),(46,'Shekhar Pundir Yogeshwar Thakur Kapoor Trust-L3-170','1'),(47,'SSD College-L3-337','1'),(48,'Sunil Gulati  City Gold-L3-180','1'),(49,'SK Food -L3-226','1'),(50,'Shivam Gupta-L3-243','1'),(51,'Samoon-L3-111','1'),(52,'Sanjeevani Siksha Peeth-L3-283','1'),(53,'Shree Balaji System-L3-255','1'),(54,'Shakshi Nandni Private Limited-L3-392','1'),(55,'Shashi Kumar-L3-279','1'),(56,'SR Steel-L3-283','1'),(57,'Sanjay Dhiman Ajay Paint-L3-290','1'),(58,'Shri Balaji Industries-L3-295','1'),(59,'Uvesh Ahmad-L3-495','1'),(60,'Vijay Chauhan Vee Cee Jewellers-L3-192','1'),(61,'Vineet Tyagi Luxmi Construction-L3-153','1'),(62,'Vikesh Gupta Galaxy Trading-L3-299','1'),(63,'Nitin Tyagi Personal-L3-104','1'),(64,'B and B Medicose Rajesh Sharma-L3-81','1'),(65,'Ashoka Infra-L3-67','1'),(66,'Ashutosh Mishra Sanrachna Nidhi Pvt Ltd-L3-121','1'),(67,'Max Enterprises Ikram Ali-L3-438','1'),(68,'Musavver Ali AM Bengle-L3-90','1'),(69,'Arush Jain New Beamingdaily infotenment-L3-454','1'),(70,'Ajay Kumar Rathi Auto Parts-L3-75','1'),(71,'Anuj chauhan Work Build-L3-443','1'),(72,'Black Owl Electronics Atul Jija-L3-141','1'),(73,'CS Grover-L3-98','1'),(74,'Devyani kakar Next Star INC-L3-47','1'),(75,'Dr. Kaushik Kaushik Pathology Lab-L3-37','1'),(76,'Gulab Gupta Gulab Enterprises-L3-449','1'),(77,'KB3 GENERAL TRADING & CONTRACTING ENT. SUCHIT CHAUDHARY-L3-165','1'),(78,'khanpur Turst Bimla Devi-L3-433','1'),(79,'Mohd. Saleem SADABAHAR FRUIT COMPANY-L3-135','1'),(80,'PPA INFRATECH ADITYA GAUTAM-L3-306','1'),(81,'Paankhi Ishwer Chand Sharma-L3-42','1'),(82,'KPRADHAN ENTERPRISES PARDUMAN SINGH-L3-159','1'),(83,'Shiva Engineering Nima Tomar-L3-53','1'),(84,'Subhash Chand Agarwal-L3-387','1'),(85,'Varalika Private Limited-L3-13','1'),(86,'Vedpal-L3-398','1'),(87,'Vinay Sharma Glass-L3-147','1');
/*!40000 ALTER TABLE `billing_client` ENABLE KEYS */;
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
