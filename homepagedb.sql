-- MySQL dump 10.13  Distrib 5.5.29, for osx10.6 (i386)
--
-- Host: localhost    Database: homepagedb
-- ------------------------------------------------------
-- Server version	5.5.29

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

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `age` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `profile_thumburl` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (1,1,25,'me','jelee8804@gmail.com','Jose','M','Lee','http://placehold.it/50x50');
INSERT INTO `person` VALUES (2,0,24,'wife','tinja@email.com','Tinja','F','Lee','http://placehold.it/50x50');
INSERT INTO `person` VALUES (3,0,22,'friend','ville@email.com','Ville','M','Halminen','http://placehold.it/50x50');
INSERT INTO `person` VALUES (4,0,20,'friend','alex@email.com','Aleksandra','F','Voroshilova','http://placehold.it/50x50');
INSERT INTO `person` VALUES (5,0,22,'friend','jesper@email.com','Jesper','M','Ruuth','http://placehold.it/50x50');
INSERT INTO `person` VALUES (6,0,26,'friend','allan@email.com','Allan','M','Arriaga','http://placehold.it/50x50');
INSERT INTO `person` VALUES (7,0,29,'friend','marek@email.com','Marek','M','Miettinen','http://placehold.it/50x50');
INSERT INTO `person` VALUES (8,0,30,'friend','pyry@email.com','Pyry','M','Ahlfors','http://placehold.it/50x50');
INSERT INTO `person` VALUES (9,0,26,'friend','mary@email.com','Mary','F','Nyamor','http://placehold.it/50x50');
INSERT INTO `person` VALUES (10,0,20,'sister','piips@email.com','Justina','F','Rautio','http://placehold.it/50x50');
INSERT INTO `person` VALUES (11,0,27,'sister','judith@email.com','Judith','F','McKenzie','http://placehold.it/50x50');
INSERT INTO `person` VALUES (12,0,27,'friend','ivan@email.com','Ivan','M','Orlov','http://placehold.it/50x50');
INSERT INTO `person` VALUES (13,0,3,'dog','leo@email.com','Leo','M','Lee','http://placehold.it/50x50');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-03-02 19:57:38
