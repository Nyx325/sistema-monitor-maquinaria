/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.6.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: marsal
-- ------------------------------------------------------
-- Server version	11.6.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Current Database: `marsal`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `marsal` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `marsal`;

--
-- Table structure for table `ApiSnapshot`
--

DROP TABLE IF EXISTS `ApiSnapshot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ApiSnapshot` (
  `snapshot_id` int(11) NOT NULL AUTO_INCREMENT,
  `snapshot_version` text NOT NULL,
  `snapshot_datetime` datetime(3) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `serial_number` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`snapshot_id`),
  KEY `ApiSnapshot_serial_number_fkey` (`serial_number`),
  CONSTRAINT `ApiSnapshot_serial_number_fkey` FOREIGN KEY (`serial_number`) REFERENCES `Equipement` (`serial_number`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ApiSnapshot`
--

LOCK TABLES `ApiSnapshot` WRITE;
/*!40000 ALTER TABLE `ApiSnapshot` DISABLE KEYS */;
INSERT INTO `ApiSnapshot` VALUES
(1,'v1.0.0','2024-11-24 10:00:00.000',1,'SN12345678901'),
(2,'v1.0.1','2024-11-24 10:30:00.000',1,'SN22345678902'),
(3,'v1.0.2','2024-11-24 11:00:00.000',0,'SN32345678903'),
(4,'v1.0.3','2024-11-24 11:30:00.000',1,'SN42345678904'),
(5,'v1.0.4','2024-11-24 12:00:00.000',0,'SN52345678905'),
(6,'v1.1.0','2024-11-24 12:30:00.000',1,'SN62345678906'),
(7,'v1.1.1','2024-11-24 13:00:00.000',1,'SN72345678907'),
(8,'v1.1.2','2024-11-24 13:30:00.000',0,'SN82345678908'),
(9,'v1.1.3','2024-11-24 14:00:00.000',1,'SN92345678909'),
(10,'v1.2.0','2024-11-24 14:30:00.000',1,'SN10234567890');
/*!40000 ALTER TABLE `ApiSnapshot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CumulativeIdleHours`
--

DROP TABLE IF EXISTS `CumulativeIdleHours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CumulativeIdleHours` (
  `cih_id` int(11) NOT NULL AUTO_INCREMENT,
  `hour` double NOT NULL,
  `date_time` datetime(3) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `snapshot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`cih_id`),
  KEY `CumulativeIdleHours_snapshot_id_fkey` (`snapshot_id`),
  CONSTRAINT `CumulativeIdleHours_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `ApiSnapshot` (`snapshot_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CumulativeIdleHours`
--

LOCK TABLES `CumulativeIdleHours` WRITE;
/*!40000 ALTER TABLE `CumulativeIdleHours` DISABLE KEYS */;
INSERT INTO `CumulativeIdleHours` VALUES
(1,2.5,'2024-11-24 08:00:00.000',1,1),
(2,5,'2024-11-24 20:00:00.000',1,1),
(3,3,'2024-11-24 08:00:00.000',1,2),
(4,6,'2024-11-24 20:00:00.000',1,2),
(5,3.5,'2024-11-24 08:00:00.000',0,3),
(6,7,'2024-11-24 20:00:00.000',0,3),
(7,4,'2024-11-24 08:00:00.000',1,4),
(8,8,'2024-11-24 20:00:00.000',1,4),
(9,4.5,'2024-11-24 08:00:00.000',0,5),
(10,9,'2024-11-24 20:00:00.000',0,5),
(11,5,'2024-11-24 08:00:00.000',1,6),
(12,10,'2024-11-24 20:00:00.000',1,6),
(13,5.5,'2024-11-24 08:00:00.000',1,7),
(14,11,'2024-11-24 20:00:00.000',1,7),
(15,6,'2024-11-24 08:00:00.000',0,8),
(16,12,'2024-11-24 20:00:00.000',0,8),
(17,6.5,'2024-11-24 08:00:00.000',1,9),
(18,13,'2024-11-24 20:00:00.000',1,9),
(19,7,'2024-11-24 08:00:00.000',1,10),
(20,14,'2024-11-24 20:00:00.000',1,10);
/*!40000 ALTER TABLE `CumulativeIdleHours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CumulativeLoadCount`
--

DROP TABLE IF EXISTS `CumulativeLoadCount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CumulativeLoadCount` (
  `clo_id` int(11) NOT NULL AUTO_INCREMENT,
  `count` int(11) NOT NULL,
  `date_time` datetime(3) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `snapshot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`clo_id`),
  KEY `CumulativeLoadCount_snapshot_id_fkey` (`snapshot_id`),
  CONSTRAINT `CumulativeLoadCount_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `ApiSnapshot` (`snapshot_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CumulativeLoadCount`
--

LOCK TABLES `CumulativeLoadCount` WRITE;
/*!40000 ALTER TABLE `CumulativeLoadCount` DISABLE KEYS */;
INSERT INTO `CumulativeLoadCount` VALUES
(1,100,'2024-11-24 08:00:00.000',1,1),
(2,200,'2024-11-24 20:00:00.000',1,1),
(3,120,'2024-11-24 08:00:00.000',1,2),
(4,240,'2024-11-24 20:00:00.000',1,2),
(5,150,'2024-11-24 08:00:00.000',0,3),
(6,300,'2024-11-24 20:00:00.000',0,3),
(7,180,'2024-11-24 08:00:00.000',1,4),
(8,360,'2024-11-24 20:00:00.000',1,4),
(9,200,'2024-11-24 08:00:00.000',0,5),
(10,400,'2024-11-24 20:00:00.000',0,5),
(11,220,'2024-11-24 08:00:00.000',1,6),
(12,440,'2024-11-24 20:00:00.000',1,6),
(13,250,'2024-11-24 08:00:00.000',1,7),
(14,500,'2024-11-24 20:00:00.000',1,7),
(15,270,'2024-11-24 08:00:00.000',0,8),
(16,540,'2024-11-24 20:00:00.000',0,8),
(17,300,'2024-11-24 08:00:00.000',1,9),
(18,600,'2024-11-24 20:00:00.000',1,9),
(19,320,'2024-11-24 08:00:00.000',1,10),
(20,640,'2024-11-24 20:00:00.000',1,10);
/*!40000 ALTER TABLE `CumulativeLoadCount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CumulativeOperatingHours`
--

DROP TABLE IF EXISTS `CumulativeOperatingHours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CumulativeOperatingHours` (
  `coh_id` int(11) NOT NULL AUTO_INCREMENT,
  `hour` double NOT NULL,
  `date_time` datetime(3) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `snapshot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`coh_id`),
  KEY `CumulativeOperatingHours_snapshot_id_fkey` (`snapshot_id`),
  CONSTRAINT `CumulativeOperatingHours_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `ApiSnapshot` (`snapshot_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CumulativeOperatingHours`
--

LOCK TABLES `CumulativeOperatingHours` WRITE;
/*!40000 ALTER TABLE `CumulativeOperatingHours` DISABLE KEYS */;
INSERT INTO `CumulativeOperatingHours` VALUES
(1,5,'2024-11-24 08:00:00.000',1,1),
(2,10,'2024-11-24 20:00:00.000',1,1),
(3,6,'2024-11-24 08:00:00.000',1,2),
(4,12,'2024-11-24 20:00:00.000',1,2),
(5,7.5,'2024-11-24 08:00:00.000',0,3),
(6,15,'2024-11-24 20:00:00.000',0,3),
(7,8,'2024-11-24 08:00:00.000',1,4),
(8,16,'2024-11-24 20:00:00.000',1,4),
(9,9,'2024-11-24 08:00:00.000',0,5),
(10,18,'2024-11-24 20:00:00.000',0,5),
(11,10.5,'2024-11-24 08:00:00.000',1,6),
(12,21,'2024-11-24 20:00:00.000',1,6),
(13,11,'2024-11-24 08:00:00.000',1,7),
(14,22,'2024-11-24 20:00:00.000',1,7),
(15,12,'2024-11-24 08:00:00.000',0,8),
(16,24,'2024-11-24 20:00:00.000',0,8),
(17,13,'2024-11-24 08:00:00.000',1,9),
(18,26,'2024-11-24 20:00:00.000',1,9),
(19,14,'2024-11-24 08:00:00.000',1,10),
(20,28,'2024-11-24 20:00:00.000',1,10),
(21,10.5,'2024-11-24 08:00:00.000',1,1),
(22,20,'2024-11-24 20:00:00.000',1,1),
(23,12,'2024-11-24 08:00:00.000',1,2),
(24,24,'2024-11-24 20:00:00.000',1,2),
(25,14.5,'2024-11-24 08:00:00.000',0,3),
(26,29,'2024-11-24 20:00:00.000',0,3),
(27,16,'2024-11-24 08:00:00.000',1,4),
(28,32,'2024-11-24 20:00:00.000',1,4),
(29,18,'2024-11-24 08:00:00.000',0,5),
(30,36,'2024-11-24 20:00:00.000',0,5),
(31,20,'2024-11-24 08:00:00.000',1,6),
(32,40,'2024-11-24 20:00:00.000',1,6),
(33,22,'2024-11-24 08:00:00.000',1,7),
(34,44,'2024-11-24 20:00:00.000',1,7),
(35,24,'2024-11-24 08:00:00.000',0,8),
(36,48,'2024-11-24 20:00:00.000',0,8),
(37,26,'2024-11-24 08:00:00.000',1,9),
(38,52,'2024-11-24 20:00:00.000',1,9),
(39,28,'2024-11-24 08:00:00.000',1,10),
(40,56,'2024-11-24 20:00:00.000',1,10);
/*!40000 ALTER TABLE `CumulativeOperatingHours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CumulativePayloadTotals`
--

DROP TABLE IF EXISTS `CumulativePayloadTotals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CumulativePayloadTotals` (
  `cpt_id` int(11) NOT NULL AUTO_INCREMENT,
  `payload_units` text NOT NULL,
  `payload` double NOT NULL,
  `date_time` datetime(3) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `snapshot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`cpt_id`),
  KEY `CumulativePayloadTotals_snapshot_id_fkey` (`snapshot_id`),
  CONSTRAINT `CumulativePayloadTotals_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `ApiSnapshot` (`snapshot_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CumulativePayloadTotals`
--

LOCK TABLES `CumulativePayloadTotals` WRITE;
/*!40000 ALTER TABLE `CumulativePayloadTotals` DISABLE KEYS */;
INSERT INTO `CumulativePayloadTotals` VALUES
(1,'toneladas',30,'2024-11-24 08:00:00.000',1,1),
(2,'toneladas',60,'2024-11-24 20:00:00.000',1,1),
(3,'toneladas',35,'2024-11-24 08:00:00.000',1,2),
(4,'toneladas',70,'2024-11-24 20:00:00.000',1,2),
(5,'toneladas',40,'2024-11-24 08:00:00.000',0,3),
(6,'toneladas',80,'2024-11-24 20:00:00.000',0,3),
(7,'toneladas',45,'2024-11-24 08:00:00.000',1,4),
(8,'toneladas',90,'2024-11-24 20:00:00.000',1,4),
(9,'toneladas',50,'2024-11-24 08:00:00.000',0,5),
(10,'toneladas',100,'2024-11-24 20:00:00.000',0,5),
(11,'toneladas',55,'2024-11-24 08:00:00.000',1,6),
(12,'toneladas',110,'2024-11-24 20:00:00.000',1,6),
(13,'toneladas',60,'2024-11-24 08:00:00.000',1,7),
(14,'toneladas',120,'2024-11-24 20:00:00.000',1,7),
(15,'toneladas',65,'2024-11-24 08:00:00.000',0,8),
(16,'toneladas',130,'2024-11-24 20:00:00.000',0,8),
(17,'toneladas',70,'2024-11-24 08:00:00.000',1,9),
(18,'toneladas',140,'2024-11-24 20:00:00.000',1,9),
(19,'toneladas',75,'2024-11-24 08:00:00.000',1,10),
(20,'toneladas',150,'2024-11-24 20:00:00.000',1,10);
/*!40000 ALTER TABLE `CumulativePayloadTotals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DefRemaining`
--

DROP TABLE IF EXISTS `DefRemaining`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DefRemaining` (
  `def_remaining_id` int(11) NOT NULL AUTO_INCREMENT,
  `percent` double NOT NULL,
  `date_time` datetime(3) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `snapshot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`def_remaining_id`),
  KEY `DefRemaining_snapshot_id_fkey` (`snapshot_id`),
  CONSTRAINT `DefRemaining_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `ApiSnapshot` (`snapshot_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DefRemaining`
--

LOCK TABLES `DefRemaining` WRITE;
/*!40000 ALTER TABLE `DefRemaining` DISABLE KEYS */;
INSERT INTO `DefRemaining` VALUES
(1,12.5,'2024-11-24 08:00:00.000',1,1),
(2,25,'2024-11-24 20:00:00.000',1,1),
(3,15,'2024-11-24 08:00:00.000',1,2),
(4,30,'2024-11-24 20:00:00.000',1,2),
(5,17.5,'2024-11-24 08:00:00.000',0,3),
(6,35,'2024-11-24 20:00:00.000',0,3),
(7,20,'2024-11-24 08:00:00.000',1,4),
(8,40,'2024-11-24 20:00:00.000',1,4),
(9,22.5,'2024-11-24 08:00:00.000',0,5),
(10,45,'2024-11-24 20:00:00.000',0,5),
(11,25,'2024-11-24 08:00:00.000',1,6),
(12,50,'2024-11-24 20:00:00.000',1,6),
(13,27.5,'2024-11-24 08:00:00.000',1,7),
(14,55,'2024-11-24 20:00:00.000',1,7),
(15,30,'2024-11-24 08:00:00.000',0,8),
(16,60,'2024-11-24 20:00:00.000',0,8),
(17,32.5,'2024-11-24 08:00:00.000',1,9),
(18,65,'2024-11-24 20:00:00.000',1,9),
(19,35,'2024-11-24 08:00:00.000',1,10),
(20,70,'2024-11-24 20:00:00.000',1,10);
/*!40000 ALTER TABLE `DefRemaining` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Distance`
--

DROP TABLE IF EXISTS `Distance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Distance` (
  `distance_id` int(11) NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `date_time` datetime(3) NOT NULL,
  `odometer` double NOT NULL,
  `odometer_units` text NOT NULL,
  `snapshot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`distance_id`),
  KEY `Distance_snapshot_id_fkey` (`snapshot_id`),
  CONSTRAINT `Distance_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `ApiSnapshot` (`snapshot_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Distance`
--

LOCK TABLES `Distance` WRITE;
/*!40000 ALTER TABLE `Distance` DISABLE KEYS */;
INSERT INTO `Distance` VALUES
(1,1,'2024-11-24 08:00:00.000',15000.5,'km',1),
(2,1,'2024-11-24 20:00:00.000',15100,'km',1),
(3,1,'2024-11-24 08:00:00.000',12000,'km',2),
(4,1,'2024-11-24 20:00:00.000',12200.5,'km',2),
(5,0,'2024-11-24 08:00:00.000',18000.5,'km',3),
(6,0,'2024-11-24 20:00:00.000',18200,'km',3),
(7,1,'2024-11-24 08:00:00.000',13500,'km',4),
(8,1,'2024-11-24 20:00:00.000',13700.5,'km',4),
(9,0,'2024-11-24 08:00:00.000',15000,'km',5),
(10,0,'2024-11-24 20:00:00.000',15300.5,'km',5),
(11,1,'2024-11-24 08:00:00.000',16000.5,'km',6),
(12,1,'2024-11-24 20:00:00.000',16200,'km',6),
(13,1,'2024-11-24 08:00:00.000',17000,'km',7),
(14,1,'2024-11-24 20:00:00.000',17200.5,'km',7),
(15,0,'2024-11-24 08:00:00.000',14500.5,'km',8),
(16,0,'2024-11-24 20:00:00.000',14800,'km',8),
(17,1,'2024-11-24 08:00:00.000',12500,'km',9),
(18,1,'2024-11-24 20:00:00.000',12700.5,'km',9),
(19,1,'2024-11-24 08:00:00.000',14000.5,'km',10),
(20,1,'2024-11-24 20:00:00.000',14200,'km',10);
/*!40000 ALTER TABLE `Distance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EngineStatus`
--

DROP TABLE IF EXISTS `EngineStatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EngineStatus` (
  `engine_status_id` int(11) NOT NULL AUTO_INCREMENT,
  `date_time` datetime(3) NOT NULL,
  `engine_number` text NOT NULL,
  `running` tinyint(1) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `snapshot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`engine_status_id`),
  KEY `EngineStatus_snapshot_id_fkey` (`snapshot_id`),
  CONSTRAINT `EngineStatus_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `ApiSnapshot` (`snapshot_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EngineStatus`
--

LOCK TABLES `EngineStatus` WRITE;
/*!40000 ALTER TABLE `EngineStatus` DISABLE KEYS */;
INSERT INTO `EngineStatus` VALUES
(1,'2024-11-24 08:00:00.000','ENG-12345678901',1,1,1),
(2,'2024-11-24 20:00:00.000','ENG-12345678901',0,1,1),
(3,'2024-11-24 08:00:00.000','ENG-22345678902',1,1,2),
(4,'2024-11-24 20:00:00.000','ENG-22345678902',0,1,2),
(5,'2024-11-24 08:00:00.000','ENG-32345678903',1,1,3),
(6,'2024-11-24 20:00:00.000','ENG-32345678903',1,1,3),
(7,'2024-11-24 08:00:00.000','ENG-42345678904',1,1,4),
(8,'2024-11-24 20:00:00.000','ENG-42345678904',1,1,4),
(9,'2024-11-24 08:00:00.000','ENG-52345678905',0,1,5),
(10,'2024-11-24 20:00:00.000','ENG-52345678905',0,1,5),
(11,'2024-11-24 08:00:00.000','ENG-62345678906',1,1,6),
(12,'2024-11-24 20:00:00.000','ENG-62345678906',0,1,6),
(13,'2024-11-24 08:00:00.000','ENG-72345678907',1,1,7),
(14,'2024-11-24 20:00:00.000','ENG-72345678907',1,1,7),
(15,'2024-11-24 08:00:00.000','ENG-82345678908',0,1,8),
(16,'2024-11-24 20:00:00.000','ENG-82345678908',1,1,8),
(17,'2024-11-24 08:00:00.000','ENG-92345678909',0,1,9),
(18,'2024-11-24 20:00:00.000','ENG-92345678909',0,1,9),
(19,'2024-11-24 08:00:00.000','ENG-10234567890',1,1,10),
(20,'2024-11-24 20:00:00.000','ENG-10234567890',1,1,10);
/*!40000 ALTER TABLE `EngineStatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Equipement`
--

DROP TABLE IF EXISTS `Equipement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Equipement` (
  `serial_number` varchar(25) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `oem_name` text NOT NULL,
  `model` text NOT NULL,
  PRIMARY KEY (`serial_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Equipement`
--

LOCK TABLES `Equipement` WRITE;
/*!40000 ALTER TABLE `Equipement` DISABLE KEYS */;
INSERT INTO `Equipement` VALUES
('SN10234567890',1,'Terex','TR70 Dump Truck'),
('SN12345678901',1,'Caterpillar','D9T Bulldozer'),
('SN22345678902',1,'Komatsu','PC200 Excavator'),
('SN32345678903',0,'John Deere','744K Loader'),
('SN42345678904',1,'Volvo','EC750E Excavator'),
('SN52345678905',0,'Hitachi','ZX350LC Excavator'),
('SN62345678906',1,'Liebherr','R 9800 Excavator'),
('SN72345678907',1,'Case','CX145DSR Excavator'),
('SN82345678908',0,'Doosan','DX225LC Excavator'),
('SN92345678909',1,'Hyundai','HL960 Loader');
/*!40000 ALTER TABLE `Equipement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FaultCode`
--

DROP TABLE IF EXISTS `FaultCode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FaultCode` (
  `folio` int(11) NOT NULL AUTO_INCREMENT,
  `code_identifier` varchar(10) NOT NULL,
  `code_description` text NOT NULL,
  `code_severity` text NOT NULL,
  `air_temperature` text NOT NULL,
  `temperature_unit` text NOT NULL,
  `code_source` text NOT NULL,
  `date_time` datetime(3) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `snapshot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`folio`),
  KEY `FaultCode_snapshot_id_fkey` (`snapshot_id`),
  CONSTRAINT `FaultCode_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `ApiSnapshot` (`snapshot_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FaultCode`
--

LOCK TABLES `FaultCode` WRITE;
/*!40000 ALTER TABLE `FaultCode` DISABLE KEYS */;
INSERT INTO `FaultCode` VALUES
(1,'FC-001','Engine overheating','High','105','Celsius','Sensor','2024-11-24 08:00:00.000',1,1),
(2,'FC-002','Low fuel pressure','Medium','85','Celsius','Sensor','2024-11-24 08:15:00.000',1,2),
(3,'FC-003','Oil leak detected','High','40','Celsius','Sensor','2024-11-24 08:30:00.000',1,3),
(4,'FC-004','Battery voltage low','Medium','30','Celsius','Sensor','2024-11-24 08:45:00.000',1,4),
(5,'FC-005','Fuel filter clogging','Low','25','Celsius','Sensor','2024-11-24 09:00:00.000',1,5),
(6,'FC-006','Turbocharger malfunction','High','110','Celsius','Sensor','2024-11-24 09:30:00.000',1,6),
(7,'FC-007','Transmission fluid leak','High','45','Celsius','Sensor','2024-11-24 10:00:00.000',1,7),
(8,'FC-008','Exhaust system failure','Medium','50','Celsius','Sensor','2024-11-24 10:15:00.000',1,8),
(9,'FC-009','Coolant level low','Low','60','Celsius','Sensor','2024-11-24 10:45:00.000',1,9),
(10,'FC-010','Fuel temperature too high','Medium','75','Celsius','Sensor','2024-11-24 11:00:00.000',1,10),
(11,'FC-001','Engine overheating','High','105','Celsius','Sensor','2024-11-24 08:00:00.000',1,1),
(12,'FC-002','Low fuel pressure','Medium','85','Celsius','Sensor','2024-11-24 08:15:00.000',1,2),
(13,'FC-003','Oil leak detected','High','40','Celsius','Sensor','2024-11-24 08:30:00.000',1,3),
(14,'FC-004','Battery voltage low','Medium','30','Celsius','Sensor','2024-11-24 08:45:00.000',1,4),
(15,'FC-005','Fuel filter clogging','Low','25','Celsius','Sensor','2024-11-24 09:00:00.000',1,5),
(16,'FC-006','Turbocharger malfunction','High','110','Celsius','Sensor','2024-11-24 09:30:00.000',1,6),
(17,'FC-007','Transmission fluid leak','High','45','Celsius','Sensor','2024-11-24 10:00:00.000',1,7),
(18,'FC-008','Exhaust system failure','Medium','50','Celsius','Sensor','2024-11-24 10:15:00.000',1,8),
(19,'FC-009','Coolant level low','Low','60','Celsius','Sensor','2024-11-24 10:45:00.000',1,9),
(20,'FC-010','Fuel temperature too high','Medium','75','Celsius','Sensor','2024-11-24 11:00:00.000',1,10);
/*!40000 ALTER TABLE `FaultCode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FuelRemaining`
--

DROP TABLE IF EXISTS `FuelRemaining`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FuelRemaining` (
  `fuel_remaining_id` int(11) NOT NULL AUTO_INCREMENT,
  `percent` double NOT NULL,
  `date_time` datetime(3) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `snapshot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`fuel_remaining_id`),
  KEY `FuelRemaining_snapshot_id_fkey` (`snapshot_id`),
  CONSTRAINT `FuelRemaining_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `ApiSnapshot` (`snapshot_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FuelRemaining`
--

LOCK TABLES `FuelRemaining` WRITE;
/*!40000 ALTER TABLE `FuelRemaining` DISABLE KEYS */;
/*!40000 ALTER TABLE `FuelRemaining` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FuelUsed`
--

DROP TABLE IF EXISTS `FuelUsed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FuelUsed` (
  `fuel_used_id` int(11) NOT NULL AUTO_INCREMENT,
  `fuel_consumed` int(11) NOT NULL,
  `date_time` datetime(3) NOT NULL,
  `fuel_units` text NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `snapshot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`fuel_used_id`),
  KEY `FuelUsed_snapshot_id_fkey` (`snapshot_id`),
  CONSTRAINT `FuelUsed_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `ApiSnapshot` (`snapshot_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FuelUsed`
--

LOCK TABLES `FuelUsed` WRITE;
/*!40000 ALTER TABLE `FuelUsed` DISABLE KEYS */;
INSERT INTO `FuelUsed` VALUES
(1,50,'2024-11-24 08:00:00.000','litros',1,1),
(2,120,'2024-11-24 20:00:00.000','litros',1,1),
(3,60,'2024-11-24 08:00:00.000','litros',1,2),
(4,130,'2024-11-24 20:00:00.000','litros',1,2),
(5,75,'2024-11-24 08:00:00.000','litros',0,3),
(6,150,'2024-11-24 20:00:00.000','litros',0,3),
(7,80,'2024-11-24 08:00:00.000','litros',1,4),
(8,160,'2024-11-24 20:00:00.000','litros',1,4),
(9,90,'2024-11-24 08:00:00.000','litros',0,5),
(10,180,'2024-11-24 20:00:00.000','litros',0,5),
(11,105,'2024-11-24 08:00:00.000','litros',1,6),
(12,210,'2024-11-24 20:00:00.000','litros',1,6),
(13,110,'2024-11-24 08:00:00.000','litros',1,7),
(14,220,'2024-11-24 20:00:00.000','litros',1,7),
(15,120,'2024-11-24 08:00:00.000','litros',0,8),
(16,240,'2024-11-24 20:00:00.000','litros',0,8),
(17,130,'2024-11-24 08:00:00.000','litros',1,9),
(18,260,'2024-11-24 20:00:00.000','litros',1,9),
(19,140,'2024-11-24 08:00:00.000','litros',1,10),
(20,280,'2024-11-24 20:00:00.000','litros',1,10);
/*!40000 ALTER TABLE `FuelUsed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FuelUsedLast24`
--

DROP TABLE IF EXISTS `FuelUsedLast24`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FuelUsedLast24` (
  `fuel_used_id` int(11) NOT NULL AUTO_INCREMENT,
  `fuel_consumed` int(11) NOT NULL,
  `date_time` datetime(3) NOT NULL,
  `fuel_units` text NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `snapshot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`fuel_used_id`),
  KEY `FuelUsedLast24_snapshot_id_fkey` (`snapshot_id`),
  CONSTRAINT `FuelUsedLast24_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `ApiSnapshot` (`snapshot_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FuelUsedLast24`
--

LOCK TABLES `FuelUsedLast24` WRITE;
/*!40000 ALTER TABLE `FuelUsedLast24` DISABLE KEYS */;
INSERT INTO `FuelUsedLast24` VALUES
(1,120,'2024-11-24 08:00:00.000','litros',1,1),
(2,130,'2024-11-24 08:30:00.000','litros',1,2),
(3,110,'2024-11-24 09:00:00.000','litros',1,3),
(4,140,'2024-11-24 09:30:00.000','litros',1,4),
(5,100,'2024-11-24 10:00:00.000','litros',1,5),
(6,150,'2024-11-24 10:30:00.000','litros',1,6),
(7,115,'2024-11-24 11:00:00.000','litros',1,7),
(8,125,'2024-11-24 11:30:00.000','litros',1,8),
(9,105,'2024-11-24 12:00:00.000','litros',1,9),
(10,135,'2024-11-24 12:30:00.000','litros',1,10);
/*!40000 ALTER TABLE `FuelUsedLast24` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Location`
--

DROP TABLE IF EXISTS `Location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Location` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `altitude` double NOT NULL,
  `altitude_units` text NOT NULL,
  `china_coordinate_id` double DEFAULT NULL,
  `date_time` datetime(3) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `snapshot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`location_id`),
  KEY `Location_snapshot_id_fkey` (`snapshot_id`),
  CONSTRAINT `Location_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `ApiSnapshot` (`snapshot_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Location`
--

LOCK TABLES `Location` WRITE;
/*!40000 ALTER TABLE `Location` DISABLE KEYS */;
INSERT INTO `Location` VALUES
(1,34.0522,-118.2437,100.5,'meters',NULL,'2024-11-24 08:00:00.000',1,1),
(2,40.7128,-74.006,10.2,'meters',NULL,'2024-11-24 08:30:00.000',1,2),
(3,51.5074,-0.1278,35.8,'meters',NULL,'2024-11-24 09:00:00.000',1,3),
(4,48.8566,2.3522,15.3,'meters',NULL,'2024-11-24 09:30:00.000',1,4),
(5,34.0522,-118.2437,200.7,'meters',NULL,'2024-11-24 10:00:00.000',1,5),
(6,40.7128,-74.006,45.6,'meters',NULL,'2024-11-24 10:30:00.000',1,6),
(7,51.5074,-0.1278,95.3,'meters',NULL,'2024-11-24 11:00:00.000',1,7),
(8,48.8566,2.3522,25.1,'meters',NULL,'2024-11-24 11:30:00.000',1,8),
(9,34.0522,-118.2437,150.3,'meters',NULL,'2024-11-24 12:00:00.000',1,9),
(10,40.7128,-74.006,60.8,'meters',NULL,'2024-11-24 12:30:00.000',1,10);
/*!40000 ALTER TABLE `Location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Logs`
--

DROP TABLE IF EXISTS `Logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Logs` (
  `log_folio` int(11) NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `message` varchar(191) NOT NULL,
  PRIMARY KEY (`log_folio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Logs`
--

LOCK TABLES `Logs` WRITE;
/*!40000 ALTER TABLE `Logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `Logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(25) NOT NULL,
  `user_name` varchar(15) NOT NULL,
  `user_password` varchar(15) NOT NULL,
  `user_type` enum('ADMIN','ANALIST','MANAGER') NOT NULL DEFAULT 'ANALIST',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `email` varchar(191) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES
('0d266ec9-2a86-440e-9fec-5a7e1be2e23a','b66755b1401c7e93ad7e9dd91a920bb6dc9e6e6cde5b6c50207ce710013c691c','2024-11-25 03:37:32.264','20241112022516_prueba',NULL,NULL,'2024-11-25 03:37:31.945',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2024-11-24 23:25:56
