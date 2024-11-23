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
) ENGINE=InnoDB AUTO_INCREMENT=174 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ApiSnapshot`
--

LOCK TABLES `ApiSnapshot` WRITE;
/*!40000 ALTER TABLE `ApiSnapshot` DISABLE KEYS */;
INSERT INTO `ApiSnapshot` VALUES
(1,'1.0.0','2024-11-12 17:36:13.426',1,'1'),
(2,'1.0.0','2024-11-12 17:36:17.416',1,'1'),
(3,'1.0.0','2024-11-13 15:38:42.325',1,'1'),
(4,'1.0.0','2024-11-13 15:51:42.909',1,'1'),
(5,'1.0.0','2024-11-13 15:51:45.985',1,'1'),
(6,'1.0.0','2024-11-13 15:51:48.371',1,'1'),
(7,'v1.0','2024-11-01 12:30:00.000',1,'1'),
(8,'v1.0','2024-11-02 14:00:00.000',1,'15'),
(9,'v2.0','2024-11-03 15:30:00.000',1,'akdjlasd'),
(10,'v2.1','2024-11-04 16:45:00.000',1,'SN116155'),
(11,'v1.5','2024-11-05 18:00:00.000',1,'SN132977'),
(12,'v1.0','2024-11-01 12:30:00.000',1,'1'),
(13,'v1.0','2024-11-02 14:00:00.000',1,'15'),
(14,'v2.0','2024-11-03 15:30:00.000',1,'akdjlasd'),
(15,'v2.1','2024-11-04 16:45:00.000',1,'SN116155'),
(16,'v1.5','2024-11-05 18:00:00.000',1,'SN132977'),
(17,'v1.0','2024-11-01 12:30:00.000',1,'1'),
(18,'v1.0','2024-11-02 14:00:00.000',1,'15'),
(19,'v2.0','2024-11-03 15:30:00.000',1,'akdjlasd'),
(20,'v2.1','2024-11-04 16:45:00.000',1,'SN116155'),
(21,'v1.5','2024-11-05 18:00:00.000',1,'SN132977'),
(22,'v1.0','2024-11-01 12:30:00.000',1,'1'),
(23,'v1.0','2024-11-02 14:00:00.000',1,'15'),
(24,'v2.0','2024-11-03 15:30:00.000',1,'akdjlasd'),
(25,'v2.1','2024-11-04 16:45:00.000',1,'SN116155'),
(26,'v1.5','2024-11-05 18:00:00.000',1,'SN132977'),
(27,'v1.0','2024-11-01 12:30:00.000',1,'1'),
(28,'v1.0','2024-11-02 14:00:00.000',1,'15'),
(29,'v2.0','2024-11-03 15:30:00.000',1,'akdjlasd'),
(30,'v2.1','2024-11-04 16:45:00.000',1,'SN116155'),
(31,'v1.5','2024-11-05 18:00:00.000',1,'SN132977'),
(32,'v1.0','2024-11-01 12:30:00.000',1,'1'),
(33,'v1.0','2024-11-02 14:00:00.000',1,'15'),
(34,'v2.0','2024-11-03 15:30:00.000',1,'akdjlasd'),
(35,'v2.1','2024-11-04 16:45:00.000',1,'SN116155'),
(36,'v1.5','2024-11-05 18:00:00.000',1,'SN132977'),
(37,'v1.0','2024-11-01 12:30:00.000',1,'1'),
(38,'v1.0','2024-11-02 14:00:00.000',1,'15'),
(39,'v2.0','2024-11-03 15:30:00.000',1,'akdjlasd'),
(40,'v2.1','2024-11-04 16:45:00.000',1,'SN116155'),
(41,'v1.5','2024-11-05 18:00:00.000',1,'SN132977'),
(42,'v1.0','2024-11-01 12:30:00.000',1,'1'),
(43,'v1.0','2024-11-02 14:00:00.000',1,'15'),
(44,'v2.0','2024-11-03 15:30:00.000',1,'akdjlasd'),
(45,'v2.1','2024-11-04 16:45:00.000',1,'SN116155'),
(46,'v1.5','2024-11-05 18:00:00.000',1,'SN132977'),
(47,'v1.0','2024-11-01 12:30:00.000',1,'1'),
(48,'v1.0','2024-11-02 14:00:00.000',1,'15'),
(49,'v2.0','2024-11-03 15:30:00.000',1,'akdjlasd'),
(50,'v2.1','2024-11-04 16:45:00.000',1,'SN116155'),
(51,'v1.5','2024-11-05 18:00:00.000',1,'SN132977'),
(52,'v1.0','2024-11-01 12:30:00.000',1,'1'),
(53,'v1.0','2024-11-02 14:00:00.000',1,'15'),
(54,'v2.0','2024-11-03 15:30:00.000',1,'akdjlasd'),
(55,'v2.1','2024-11-04 16:45:00.000',1,'SN116155'),
(56,'v1.5','2024-11-05 18:00:00.000',1,'SN132977'),
(57,'1.0.0','2024-11-15 05:50:12.875',1,'1'),
(58,'1.0.0','2024-11-15 15:03:24.360',1,'1'),
(59,'1.0.0','2024-11-15 15:04:15.422',1,'1'),
(60,'1.0.0','2024-11-15 15:04:17.505',1,'1'),
(61,'1.0.0','2024-11-15 15:06:51.247',1,'1'),
(62,'1.0.0','2024-11-15 15:10:15.763',1,'1'),
(63,'1.0.0','2024-11-15 15:10:26.941',1,'1'),
(64,'1.0.0','2024-11-16 16:53:52.163',1,'1'),
(65,'1.0.0','2024-11-16 17:37:59.278',1,'15'),
(66,'1.0.0','2024-11-16 17:38:32.409',1,'1'),
(67,'1.0.0','2024-11-16 17:38:36.782',1,'1'),
(68,'1.0.0','2024-11-16 17:38:38.865',1,'1'),
(69,'1.0.0','2024-11-16 17:38:44.094',1,'1'),
(70,'1.0.0','2024-11-16 17:38:50.961',1,'1'),
(71,'1.0.0','2024-11-16 17:42:32.793',1,'1'),
(72,'1.0.0','2024-11-16 17:42:33.863',1,'1'),
(73,'1.0.0','2024-11-16 17:43:18.756',1,'1'),
(74,'1.0.0','2024-11-16 17:43:25.234',1,'1'),
(75,'1.0.0','2024-11-16 17:43:31.903',1,'1'),
(76,'1.0.0','2024-11-16 17:43:37.456',1,'1'),
(77,'1.0.0','2024-11-16 17:55:07.974',1,'1'),
(78,'1.0.0','2024-11-16 17:55:25.654',1,'1'),
(79,'1.0.0','2024-11-16 17:55:26.668',1,'1'),
(80,'1.0.0','2024-11-16 17:55:36.679',1,'1'),
(81,'1.0.0','2024-11-16 19:02:26.444',1,'adh-asd-asd'),
(82,'1.0.0','2024-11-18 18:11:58.755',1,'1'),
(83,'1.0.0','2024-11-18 18:12:00.795',1,'1'),
(84,'1.0.0','2024-11-18 18:12:01.831',1,'1'),
(85,'1.0.0','2024-11-18 18:12:02.563',1,'1'),
(86,'1.0.0','2024-11-18 22:39:30.596',1,'1'),
(87,'1.0.0','2024-11-18 22:39:32.871',1,'1'),
(88,'1.0.0','2024-11-18 22:39:33.576',1,'1'),
(89,'1.0.0','2024-11-18 22:39:34.214',1,'1'),
(90,'1.0.0','2024-11-18 22:39:34.901',1,'1'),
(91,'1.0.0','2024-11-18 22:39:35.429',1,'1'),
(92,'1.0.0','2024-11-18 22:39:36.084',1,'1'),
(93,'1.0.0','2024-11-19 00:23:37.491',1,'1'),
(94,'1.0.0','2024-11-19 04:10:03.438',1,'1'),
(95,'1.0.0','2024-11-19 04:10:06.273',1,'1'),
(96,'1.0.0','2024-11-19 04:10:07.043',1,'1'),
(97,'1.0.0','2024-11-19 04:10:07.660',1,'1'),
(98,'1.0.0','2024-11-19 04:10:08.233',1,'1'),
(99,'1.0.0','2024-11-19 06:17:29.708',1,'1'),
(100,'1.0.0','2024-11-19 06:17:41.124',1,'1'),
(101,'1.0.0','2024-11-19 18:47:42.782',1,'1'),
(102,'v1.0','2024-11-21 08:00:00.000',1,'SN12345A1'),
(103,'v1.1','2024-11-21 08:15:00.000',1,'SN12345B2'),
(104,'v1.2','2024-11-21 08:30:00.000',1,'SN12345C3'),
(105,'v1.3','2024-11-21 08:45:00.000',1,'SN12345D4'),
(106,'v1.4','2024-11-21 09:00:00.000',1,'SN12345E5'),
(107,'v1.5','2024-11-21 09:15:00.000',1,'SN12345F6'),
(108,'v1.6','2024-11-21 09:30:00.000',1,'SN12345G7'),
(109,'v1.7','2024-11-21 09:45:00.000',1,'SN12345H8'),
(110,'v1.8','2024-11-21 10:00:00.000',1,'SN12345I9'),
(111,'v1.9','2024-11-21 10:15:00.000',1,'SN12345J0'),
(112,'v1.0','2024-11-22 10:00:00.000',1,'SN12345A1'),
(113,'v1.0','2024-11-22 13:00:00.000',1,'SN54321A1'),
(114,'v1.0','2024-11-22 14:00:00.000',1,'SN67890A1'),
(115,'v1.0','2024-11-22 15:00:00.000',1,'SN98765D4'),
(116,'v1.0','2024-11-22 16:00:00.000',1,'SN993720'),
(117,'v1.0','2024-11-22 17:00:00.000',1,'SN54321D4'),
(118,'v1.0','2024-11-22 18:00:00.000',1,'SN98765H8'),
(119,'v1.0','2024-11-22 19:00:00.000',1,'SN67890C3'),
(120,'v1.0','2024-11-22 20:00:00.000',1,'SN900706'),
(121,'v1.0','2024-11-22 21:00:00.000',1,'SN588591'),
(122,'v1.0','2024-11-22 22:00:00.000',1,'SN611035'),
(123,'v1.0','2024-11-22 23:00:00.000',1,'SN671909'),
(124,'v1.0','2024-11-23 00:00:00.000',1,'SN493540'),
(125,'v1.0','2024-11-23 01:00:00.000',1,'SN54321H8'),
(126,'v1.0','2024-11-23 02:00:00.000',1,'SN67890D4'),
(127,'v1.0','2024-11-23 03:00:00.000',1,'SN586598'),
(128,'v1.0','2024-11-23 04:00:00.000',1,'SN599252'),
(129,'v1.0','2024-11-23 05:00:00.000',1,'SN735932'),
(130,'v1.0','2024-11-23 06:00:00.000',1,'SN784229'),
(131,'v1.0','2024-11-23 07:00:00.000',1,'SN437792'),
(132,'v1.0','2024-11-23 08:00:00.000',1,'SN460389'),
(133,'v1.0','2024-11-23 09:00:00.000',1,'SN361730'),
(134,'v1.0','2024-11-23 10:00:00.000',1,'SN285064'),
(135,'v1.0','2024-11-23 11:00:00.000',1,'SN98765F6'),
(136,'v1.0','2024-11-23 12:00:00.000',1,'SN54321F6'),
(137,'v1.0','2024-11-23 03:00:00.000',1,'SN586598'),
(138,'v1.0','2024-11-23 04:00:00.000',1,'SN599252'),
(139,'v1.0','2024-11-23 05:00:00.000',1,'SN735932'),
(140,'v1.0','2024-11-23 06:00:00.000',1,'SN784229'),
(141,'v1.0','2024-11-23 07:00:00.000',1,'SN437792'),
(142,'v1.0','2024-11-23 08:00:00.000',1,'SN460389'),
(143,'v1.0','2024-11-23 09:00:00.000',1,'SN361730'),
(144,'v1.0','2024-11-23 10:00:00.000',1,'SN285064'),
(145,'v1.0','2024-11-23 11:00:00.000',1,'SN98765F6'),
(146,'v1.0','2024-11-23 12:00:00.000',1,'SN54321F6'),
(147,'v1.1','2024-11-22 10:02:12.000',1,'SN996369'),
(148,'v1.1','2024-11-22 10:02:12.000',1,'SN993720'),
(149,'v1.1','2024-11-22 10:02:12.000',1,'SN98765J0'),
(150,'v1.1','2024-11-22 10:02:12.000',1,'SN98765I9'),
(151,'v1.1','2024-11-22 10:02:12.000',1,'SN98765H8'),
(152,'v1.1','2024-11-22 10:02:12.000',1,'SN98765G7'),
(153,'v1.1','2024-11-22 10:02:12.000',1,'SN98765F6'),
(154,'v1.1','2024-11-22 10:02:12.000',1,'SN98765E5'),
(155,'v1.1','2024-11-22 10:02:12.000',1,'SN98765D4'),
(156,'v1.1','2024-11-22 10:02:12.000',1,'SN98765C3'),
(157,'v1.1','2024-11-22 10:02:12.000',1,'SN98765B2'),
(158,'v1.1','2024-11-22 10:02:12.000',1,'SN98765A1'),
(159,'v1.1','2024-11-22 10:02:12.000',1,'SN979622'),
(160,'v1.1','2024-11-22 10:02:12.000',1,'SN934245'),
(161,'v1.1','2024-11-22 10:02:12.000',1,'SN934142'),
(162,'v1.1','2024-11-22 10:02:12.000',1,'SN921213'),
(163,'v1.1','2024-11-22 10:02:12.000',1,'SN910953'),
(164,'v1.1','2024-11-22 10:02:12.000',1,'SN905102'),
(165,'v1.1','2024-11-22 10:02:12.000',1,'SN900706'),
(166,'v1.1','2024-11-22 10:02:12.000',1,'SN867783'),
(167,'1.0.0','2024-11-22 20:59:53.282',1,'1'),
(168,'1.0.0','2024-11-22 21:00:13.540',1,'1'),
(169,'1.0.0','2024-11-22 21:00:20.678',1,'1'),
(170,'1.0.0','2024-11-22 21:02:15.936',1,'1'),
(171,'1.0.0','2024-11-22 21:05:21.417',1,'1'),
(172,'1.0.0','2024-11-22 21:06:03.794',1,'1'),
(173,'1.0.0','2024-11-22 21:07:32.002',1,'1');
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
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CumulativeIdleHours`
--

LOCK TABLES `CumulativeIdleHours` WRITE;
/*!40000 ALTER TABLE `CumulativeIdleHours` DISABLE KEYS */;
INSERT INTO `CumulativeIdleHours` VALUES
(1,7,'2024-11-18 09:02:00.000',1,3),
(2,10,'2024-02-28 07:02:00.000',1,4),
(3,10,'2024-02-28 07:02:00.000',1,5),
(4,10,'2024-02-28 07:02:00.000',1,6),
(5,5.2,'2024-11-21 08:00:00.000',1,1),
(6,3.4,'2024-11-21 08:15:00.000',1,2),
(7,6.1,'2024-11-21 08:30:00.000',1,3),
(8,2.8,'2024-11-21 08:45:00.000',1,4),
(9,4.9,'2024-11-21 09:00:00.000',1,5),
(10,7.3,'2024-11-21 09:15:00.000',1,6),
(11,2.1,'2024-11-21 09:30:00.000',1,7),
(12,3.7,'2024-11-21 09:45:00.000',1,8),
(13,5,'2024-11-21 10:00:00.000',1,9),
(14,4.2,'2024-11-21 10:15:00.000',1,10),
(15,6,'2024-11-21 10:30:00.000',1,11),
(16,5.1,'2024-11-21 10:45:00.000',1,12),
(17,3.3,'2024-11-21 11:00:00.000',1,13),
(18,7.4,'2024-11-21 11:15:00.000',1,14),
(19,6.5,'2024-11-21 11:30:00.000',1,15),
(20,2.9,'2024-11-21 11:45:00.000',1,16),
(21,4.6,'2024-11-21 12:00:00.000',1,17),
(22,3.8,'2024-11-21 12:15:00.000',1,18),
(23,5.5,'2024-11-21 12:30:00.000',1,19),
(24,6.3,'2024-11-21 12:45:00.000',1,20),
(25,7,'2024-11-21 13:00:00.000',1,21),
(26,5.8,'2024-11-21 13:15:00.000',1,22),
(27,4.1,'2024-11-21 13:30:00.000',1,23),
(28,3.6,'2024-11-21 13:45:00.000',1,24),
(29,6.8,'2024-11-21 14:00:00.000',1,25),
(30,5.7,'2024-11-21 14:15:00.000',1,26),
(31,4,'2024-11-21 14:30:00.000',1,27),
(32,6.9,'2024-11-21 14:45:00.000',1,28),
(33,3.9,'2024-11-21 15:00:00.000',1,29),
(34,4.3,'2024-11-21 15:15:00.000',1,30),
(35,7.1,'2024-11-21 15:30:00.000',1,31),
(36,6.7,'2024-11-21 15:45:00.000',1,32),
(37,5.3,'2024-11-21 16:00:00.000',1,33),
(38,6.2,'2024-11-21 16:15:00.000',1,34),
(39,4.4,'2024-11-21 16:30:00.000',1,35),
(40,3.5,'2024-11-21 16:45:00.000',1,36),
(41,5.9,'2024-11-21 17:00:00.000',1,37),
(42,6.4,'2024-11-21 17:15:00.000',1,38),
(43,7.2,'2024-11-21 17:30:00.000',0,39),
(44,2.7,'2024-11-21 17:45:00.000',1,40),
(45,5.6,'2024-11-21 18:00:00.000',1,41),
(46,3.2,'2024-11-21 18:15:00.000',0,42),
(47,4.8,'2024-11-21 18:30:00.000',0,43),
(48,7.5,'2024-11-21 18:45:00.000',0,44),
(49,3.1,'2024-11-21 19:00:00.000',1,45),
(50,5.4,'2024-11-21 19:15:00.000',1,46),
(51,6.6,'2024-11-21 19:30:00.000',1,47),
(52,4.5,'2024-11-21 19:45:00.000',0,48),
(53,3,'2024-11-21 20:00:00.000',0,49),
(54,6,'2024-11-21 20:15:00.000',1,50);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CumulativeLoadCount`
--

LOCK TABLES `CumulativeLoadCount` WRITE;
/*!40000 ALTER TABLE `CumulativeLoadCount` DISABLE KEYS */;
INSERT INTO `CumulativeLoadCount` VALUES
(1,200,'2024-01-01 00:00:00.000',1,86),
(2,10,'2024-11-14 08:03:00.000',1,87),
(3,1,'2024-01-01 00:00:00.000',1,88),
(4,1,'2024-01-01 00:00:00.000',1,89),
(5,1,'2024-01-01 00:00:00.000',1,90),
(6,1,'2024-01-01 00:00:00.000',1,91),
(7,1,'2024-01-01 00:00:00.000',1,92),
(8,5,'2024-11-01 20:23:00.000',1,93);
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
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CumulativeOperatingHours`
--

LOCK TABLES `CumulativeOperatingHours` WRITE;
/*!40000 ALTER TABLE `CumulativeOperatingHours` DISABLE KEYS */;
INSERT INTO `CumulativeOperatingHours` VALUES
(1,15,'2024-11-12 11:02:00.000',1,58),
(2,5,'2024-11-21 00:02:00.000',1,59),
(3,5,'2024-11-21 00:02:00.000',0,60),
(4,5,'2024-11-21 00:02:00.000',1,61),
(5,5,'2024-11-12 23:00:00.000',1,62),
(6,8,'2024-11-20 19:02:00.000',1,63),
(7,1250.75,'2024-10-01 10:30:15.123',1,1),
(8,3400.5,'2024-10-02 12:45:33.456',1,2),
(9,4100.25,'2024-10-03 08:15:44.789',0,3),
(10,2000.8,'2024-10-04 14:55:22.321',1,4),
(11,1800.45,'2024-10-05 16:30:10.654',0,5),
(12,2500.75,'2024-10-06 11:00:05.987',1,6),
(13,3100.9,'2024-10-07 09:45:59.432',1,7),
(14,3600.3,'2024-10-08 15:20:33.210',0,8),
(15,1300.55,'2024-10-09 13:10:12.543',1,9),
(16,2400.6,'2024-10-10 17:45:18.876',1,10),
(17,2900.85,'2024-10-11 07:00:40.159',0,1),
(18,4000.1,'2024-10-12 18:35:45.567',1,2),
(19,3500.75,'2024-10-13 14:20:50.890',1,3),
(20,1200.25,'2024-10-14 12:15:30.456',0,4),
(21,2700.4,'2024-10-15 10:10:20.123',1,5),
(22,3900.9,'2024-10-16 08:50:05.678',1,6),
(23,2100.65,'2024-10-17 16:45:55.987',0,7),
(24,3100.45,'2024-10-18 14:30:10.543',1,8),
(25,2600.8,'2024-10-19 09:20:15.654',0,9),
(26,1500.5,'2024-10-20 13:15:22.876',1,10),
(27,3000.75,'2024-10-21 11:40:44.210',1,1),
(28,2800.6,'2024-10-22 18:25:59.432',0,2),
(29,1400.2,'2024-10-23 15:50:33.123',1,3),
(30,2200.45,'2024-10-24 12:10:50.567',1,4),
(31,3700.95,'2024-10-25 08:55:18.987',0,5),
(32,3200.4,'2024-10-26 14:30:40.159',1,6),
(33,1600.3,'2024-10-27 16:20:33.456',0,7),
(34,2500.9,'2024-10-28 13:15:50.654',1,8),
(35,1900.75,'2024-10-29 09:50:45.890',1,9),
(36,2100.85,'2024-10-30 17:00:22.543',0,10),
(37,10.5,'2024-11-21 08:00:00.000',1,1),
(38,8.3,'2024-11-21 08:15:00.000',1,2),
(39,12.4,'2024-11-21 08:30:00.000',1,3),
(40,7.6,'2024-11-21 08:45:00.000',1,4),
(41,9,'2024-11-21 09:00:00.000',1,5),
(42,11.2,'2024-11-21 09:15:00.000',1,6),
(43,8.1,'2024-11-21 09:30:00.000',1,7),
(44,10.9,'2024-11-21 09:45:00.000',1,8),
(45,9.5,'2024-11-21 10:00:00.000',1,9),
(46,8.8,'2024-11-21 10:15:00.000',1,10),
(47,10.1,'2024-11-21 10:30:00.000',1,11),
(48,11.4,'2024-11-21 10:45:00.000',1,12),
(49,7.9,'2024-11-21 11:00:00.000',1,13),
(50,9.3,'2024-11-21 11:15:00.000',1,14),
(51,12,'2024-11-21 11:30:00.000',1,15),
(52,8.7,'2024-11-21 11:45:00.000',1,16),
(53,10.3,'2024-11-21 12:00:00.000',1,17),
(54,9.6,'2024-11-21 12:15:00.000',1,18),
(55,11.1,'2024-11-21 12:30:00.000',1,19),
(56,8.9,'2024-11-21 12:45:00.000',1,20),
(57,10.5,'2024-11-21 08:00:00.000',1,1),
(58,8.3,'2024-11-21 08:15:00.000',1,2),
(59,12.4,'2024-11-21 08:30:00.000',1,3),
(60,7.6,'2024-11-21 08:45:00.000',1,4),
(61,9,'2024-11-21 09:00:00.000',1,5),
(62,11.2,'2024-11-21 09:15:00.000',1,6),
(63,8.1,'2024-11-21 09:30:00.000',1,7),
(64,10.9,'2024-11-21 09:45:00.000',1,8),
(65,9.5,'2024-11-21 10:00:00.000',1,9),
(66,8.8,'2024-11-21 10:15:00.000',1,10),
(67,10.1,'2024-11-21 10:30:00.000',1,11),
(68,11.4,'2024-11-21 10:45:00.000',1,12),
(69,7.9,'2024-11-21 11:00:00.000',1,13),
(70,9.3,'2024-11-21 11:15:00.000',1,14),
(71,12,'2024-11-21 11:30:00.000',1,15),
(72,8.7,'2024-11-21 11:45:00.000',1,16),
(73,10.3,'2024-11-21 12:00:00.000',1,17),
(74,9.6,'2024-11-21 12:15:00.000',1,18),
(75,11.1,'2024-11-21 12:30:00.000',1,19),
(76,8.9,'2024-11-21 12:45:00.000',1,20),
(77,10.5,'2024-11-21 08:00:00.000',1,1),
(78,8.3,'2024-11-21 08:15:00.000',1,2),
(79,12.4,'2024-11-21 08:30:00.000',1,3),
(80,7.6,'2024-11-21 08:45:00.000',1,4),
(81,9,'2024-11-21 09:00:00.000',1,5),
(82,11.2,'2024-11-21 09:15:00.000',1,6),
(83,8.1,'2024-11-21 09:30:00.000',1,7),
(84,10.9,'2024-11-21 09:45:00.000',1,8),
(85,9.5,'2024-11-21 10:00:00.000',1,9),
(86,8.8,'2024-11-21 10:15:00.000',1,10),
(87,10.1,'2024-11-21 10:30:00.000',1,11),
(88,11.4,'2024-11-21 10:45:00.000',1,12),
(89,7.9,'2024-11-21 11:00:00.000',1,13),
(90,9.3,'2024-11-21 11:15:00.000',1,14),
(91,12,'2024-11-21 11:30:00.000',1,15),
(92,8.7,'2024-11-21 11:45:00.000',1,16),
(93,10.3,'2024-11-21 12:00:00.000',1,17),
(94,9.6,'2024-11-21 12:15:00.000',1,18),
(95,11.1,'2024-11-21 12:30:00.000',1,19),
(96,8.9,'2024-11-21 12:45:00.000',1,20),
(97,1000,'2024-11-22 10:00:00.000',1,112),
(98,1050,'2024-11-22 11:00:00.000',1,112),
(99,1100,'2024-11-22 12:00:00.000',1,112),
(100,1200,'2024-11-22 13:00:00.000',1,113),
(101,1250,'2024-11-22 14:00:00.000',1,113),
(102,1300,'2024-11-22 15:00:00.000',1,113),
(103,2000,'2024-11-22 14:00:00.000',1,113),
(104,2050,'2024-11-22 15:00:00.000',1,113),
(105,2100,'2024-11-22 16:00:00.000',1,113),
(106,3000,'2024-11-22 15:00:00.000',1,113),
(107,3050,'2024-11-22 16:00:00.000',1,113),
(108,3100,'2024-11-22 17:00:00.000',1,113),
(109,4000,'2024-11-22 16:00:00.000',1,113),
(110,4050,'2024-11-22 17:00:00.000',1,113),
(111,4100,'2024-11-22 18:00:00.000',1,113),
(112,1500,'2024-11-22 17:00:00.000',1,117),
(113,1550,'2024-11-22 18:00:00.000',1,117),
(114,1600,'2024-11-22 19:00:00.000',1,117),
(115,2500,'2024-11-22 18:00:00.000',1,117),
(116,2550,'2024-11-22 19:00:00.000',1,117),
(117,2600,'2024-11-22 20:00:00.000',1,117),
(118,3500,'2024-11-22 19:00:00.000',1,117),
(119,3550,'2024-11-22 20:00:00.000',1,117),
(120,3600,'2024-11-22 21:00:00.000',1,117),
(121,4100,'2024-11-23 03:00:00.000',1,127),
(122,4150,'2024-11-23 04:00:00.000',1,127),
(123,4200,'2024-11-23 05:00:00.000',1,127),
(124,5100,'2024-11-23 04:00:00.000',1,127),
(125,5150,'2024-11-23 05:00:00.000',1,127),
(126,5200,'2024-11-23 06:00:00.000',1,127),
(127,6100,'2024-11-23 05:00:00.000',1,127),
(128,6150,'2024-11-23 06:00:00.000',1,127),
(129,6200,'2024-11-23 07:00:00.000',1,127),
(130,4100,'2024-11-23 03:00:00.000',1,1),
(131,4150,'2024-11-23 04:00:00.000',1,1),
(132,4200,'2024-11-23 05:00:00.000',1,1),
(133,5100,'2024-11-23 04:00:00.000',1,2),
(134,5150,'2024-11-23 05:00:00.000',1,2),
(135,5200,'2024-11-23 06:00:00.000',1,2),
(136,6100,'2024-11-23 05:00:00.000',1,3),
(137,6150,'2024-11-23 06:00:00.000',1,3),
(138,6200,'2024-11-23 07:00:00.000',1,3),
(139,7100,'2024-11-23 06:00:00.000',1,4),
(140,7150,'2024-11-23 07:00:00.000',1,4),
(141,7200,'2024-11-23 08:00:00.000',1,4),
(142,8100,'2024-11-23 07:00:00.000',1,5),
(143,8150,'2024-11-23 08:00:00.000',1,5),
(144,8200,'2024-11-23 09:00:00.000',1,5),
(145,9100,'2024-11-23 08:00:00.000',1,6),
(146,9150,'2024-11-23 09:00:00.000',1,6),
(147,9200,'2024-11-23 10:00:00.000',1,6),
(148,10100,'2024-11-23 09:00:00.000',1,7),
(149,10150,'2024-11-23 10:00:00.000',1,7),
(150,10200,'2024-11-23 11:00:00.000',1,7),
(151,11100,'2024-11-23 10:00:00.000',1,8),
(152,11150,'2024-11-23 11:00:00.000',1,8),
(153,11200,'2024-11-23 12:00:00.000',1,8),
(154,12100,'2024-11-23 11:00:00.000',1,9),
(155,12150,'2024-11-23 12:00:00.000',1,9),
(156,12200,'2024-11-23 13:00:00.000',1,9),
(157,13100,'2024-11-23 12:00:00.000',1,10),
(158,13150,'2024-11-23 13:00:00.000',1,10),
(159,13200,'2024-11-23 14:00:00.000',0,10),
(160,469.8,'2024-11-22 10:02:21.000',1,147),
(161,669.68,'2024-11-22 10:02:21.000',1,148),
(162,939.02,'2024-11-22 10:02:21.000',1,149),
(163,686.05,'2024-11-22 10:02:21.000',1,150),
(164,613.18,'2024-11-22 10:02:21.000',1,151),
(165,7.77,'2024-11-22 10:02:21.000',1,152),
(166,199.32,'2024-11-22 10:02:21.000',1,153),
(167,973.27,'2024-11-22 10:02:21.000',1,154),
(168,268.4,'2024-11-22 10:02:21.000',1,155),
(169,422.17,'2024-11-22 10:02:21.000',1,156),
(170,305.66,'2024-11-22 10:02:21.000',1,157),
(171,261.8,'2024-11-22 10:02:21.000',1,158),
(172,392.02,'2024-11-22 10:02:21.000',1,159),
(173,174.69,'2024-11-22 10:02:21.000',1,160),
(174,697.39,'2024-11-22 10:02:21.000',1,161),
(175,962.9,'2024-11-22 10:02:21.000',1,162),
(176,722.3,'2024-11-22 10:02:21.000',1,163),
(177,722.83,'2024-11-22 10:02:21.000',1,164),
(178,447.23,'2024-11-22 10:02:21.000',1,165),
(179,67.66,'2024-11-22 10:02:21.000',1,166),
(180,6,'2024-11-20 09:03:00.000',1,170);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CumulativePayloadTotals`
--

LOCK TABLES `CumulativePayloadTotals` WRITE;
/*!40000 ALTER TABLE `CumulativePayloadTotals` DISABLE KEYS */;
INSERT INTO `CumulativePayloadTotals` VALUES
(1,'a',5,'2024-01-01 00:00:00.000',0,94),
(2,'a',1,'2024-01-01 00:00:00.000',1,95),
(3,'a',1,'2024-01-01 00:00:00.000',1,96),
(4,'a',1,'2024-01-01 00:00:00.000',1,97),
(5,'a',1,'2024-01-01 00:00:00.000',1,98),
(6,'asdsad',1001,'2024-11-14 07:02:00.000',0,100);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DefRemaining`
--

LOCK TABLES `DefRemaining` WRITE;
/*!40000 ALTER TABLE `DefRemaining` DISABLE KEYS */;
INSERT INTO `DefRemaining` VALUES
(1,98,'2024-01-01 00:00:00.000',1,66),
(2,100,'2024-01-01 00:00:00.000',1,67),
(3,100,'2024-01-01 00:00:00.000',1,68),
(4,10,'2024-11-16 22:00:00.000',1,70),
(5,-10,'2024-01-01 00:00:00.000',0,71),
(6,-10,'2024-01-01 00:00:00.000',0,72),
(7,10,'2024-01-01 00:00:00.000',1,76),
(8,25,'2024-11-27 21:05:00.000',1,80);
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
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Distance`
--

LOCK TABLES `Distance` WRITE;
/*!40000 ALTER TABLE `Distance` DISABLE KEYS */;
INSERT INTO `Distance` VALUES
(1,1,'2024-11-11 07:02:00.000',5,'kilometros',1),
(2,0,'2024-11-05 07:02:00.000',1,'kilometros',2),
(3,1,'2024-11-01 12:30:00.000',100.5,'km',1),
(4,1,'2024-11-02 14:00:00.000',250.8,'km',2),
(5,1,'2024-11-03 15:30:00.000',130.4,'miles',3),
(6,1,'2024-11-04 16:45:00.000',300,'km',4),
(7,1,'2024-11-05 18:00:00.000',50.3,'miles',5),
(8,1,'2024-11-06 09:20:00.000',400.2,'km',1),
(9,1,'2024-11-07 11:15:00.000',210.9,'km',2),
(10,1,'2024-11-08 13:05:00.000',180.3,'miles',3),
(11,1,'2024-11-09 15:10:00.000',350.7,'km',4),
(12,1,'2024-11-10 17:45:00.000',120.6,'miles',5),
(13,1,'2024-11-01 12:30:00.000',100.5,'km',1),
(14,1,'2024-11-02 14:00:00.000',250.8,'km',2),
(15,1,'2024-11-03 15:30:00.000',130.4,'miles',3),
(16,1,'2024-11-04 16:45:00.000',300,'km',4),
(17,1,'2024-11-05 18:00:00.000',50.3,'miles',5),
(18,1,'2024-11-06 09:20:00.000',400.2,'km',1),
(19,1,'2024-11-07 11:15:00.000',210.9,'km',2),
(20,1,'2024-11-08 13:05:00.000',180.3,'miles',3),
(21,1,'2024-11-09 15:10:00.000',350.7,'km',4),
(22,1,'2024-11-10 17:45:00.000',120.6,'miles',5),
(23,1,'2024-11-01 12:30:00.000',100.5,'km',1),
(24,1,'2024-11-02 14:00:00.000',250.8,'km',2),
(25,1,'2024-11-03 15:30:00.000',130.4,'miles',3),
(26,1,'2024-11-04 16:45:00.000',300,'km',4),
(27,1,'2024-11-05 18:00:00.000',50.3,'miles',5),
(28,1,'2024-11-06 09:20:00.000',400.2,'km',1),
(29,1,'2024-11-07 11:15:00.000',210.9,'km',2),
(30,1,'2024-11-08 13:05:00.000',180.3,'miles',3);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EngineStatus`
--

LOCK TABLES `EngineStatus` WRITE;
/*!40000 ALTER TABLE `EngineStatus` DISABLE KEYS */;
INSERT INTO `EngineStatus` VALUES
(1,'2024-01-01 00:00:00.000','sdafdkasfj',1,1,82),
(2,'2024-01-01 00:00:00.000','sdafdkasfj',1,1,83),
(3,'2024-01-01 00:00:00.000','sdafdkasfj',1,1,84),
(4,'2024-01-01 00:00:00.000','sdafdkasfj',1,1,85);
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
('1',0,'ajdlasd','djadkas'),
('15',1,'CAT','aldsald'),
('adh-asd-asd',1,'CAT','Excavadora'),
('akdjlasd',1,'alsdjalkd','asjldjsal'),
('SN11223A1',1,'OEM Tech Co.','Model RhoX'),
('SN11223B2',0,'OEM Innovations','Model SigmaX'),
('SN11223C3',1,'OEM Global','Model TauX'),
('SN11223D4',1,'OEM Enterprises','Model UpsilonX'),
('SN11223E5',0,'OEM Solutions','Model PhiX'),
('SN11223F6',1,'OEM Tech Co.','Model ChiX'),
('SN11223G7',0,'OEM Innovations','Model PsiX'),
('SN11223H8',1,'OEM Global','Model OmegaX'),
('SN116155',0,'OEM_99','Model_35'),
('SN12345A1',1,'OEM Tech Co.','Model Alpha'),
('SN12345B2',0,'OEM Innovations','Model Beta'),
('SN12345C3',1,'OEM Tech Co.','Model Gamma'),
('SN12345D4',1,'OEM Global','Model Delta'),
('SN12345E5',0,'OEM Enterprises','Model Epsilon'),
('SN12345F6',1,'OEM Solutions','Model Zeta'),
('SN12345G7',0,'OEM Global','Model Eta'),
('SN12345H8',1,'OEM Tech Co.','Model Theta'),
('SN12345I9',1,'OEM Innovations','Model Iota'),
('SN12345J0',0,'OEM Enterprises','Model Kappa'),
('SN132977',1,'OEM_69','Model_27'),
('SN163795',1,'OEM_30','Model_48'),
('SN173629',0,'OEM_27','Model_21'),
('SN182892',0,'OEM_37','Model_43'),
('SN208967',0,'OEM_4','Model_37'),
('SN218894',0,'OEM_22','Model_35'),
('SN221581',0,'OEM_27','Model_18'),
('SN227416',1,'OEM_41','Model_18'),
('SN239593',0,'OEM_53','Model_1'),
('SN262653',0,'OEM_51','Model_26'),
('SN285064',1,'OEM_98','Model_7'),
('SN289858',1,'OEM_94','Model_8'),
('SN340466',0,'OEM_71','Model_12'),
('SN361730',0,'OEM_40','Model_42'),
('SN371123',1,'OEM_83','Model_44'),
('SN408796',0,'OEM_44','Model_36'),
('SN437792',1,'OEM_88','Model_30'),
('SN453400',0,'OEM_7','Model_50'),
('SN460389',1,'OEM_48','Model_38'),
('SN475973',0,'OEM_1','Model_35'),
('SN493540',1,'OEM_90','Model_48'),
('SN54321A1',1,'OEM Tech Co.','Model Lambda'),
('SN54321B2',1,'OEM Innovations','Model Mu'),
('SN54321C3',0,'OEM Global','Model Nu'),
('SN54321D4',1,'OEM Enterprises','Model Xi'),
('SN54321E5',0,'OEM Solutions','Model Omicron'),
('SN54321F6',1,'OEM Tech Co.','Model Pi'),
('SN54321G7',0,'OEM Innovations','Model Rho'),
('SN54321H8',1,'OEM Global','Model Sigma'),
('SN54321I9',1,'OEM Enterprises','Model Tau'),
('SN54321J0',0,'OEM Solutions','Model Upsilon'),
('SN544629',0,'OEM_71','Model_10'),
('SN546661',0,'OEM_75','Model_21'),
('SN549779',0,'OEM_68','Model_4'),
('SN563405',0,'OEM_94','Model_10'),
('SN575953',0,'OEM_80','Model_7'),
('SN586598',1,'OEM_37','Model_2'),
('SN588591',1,'OEM_2','Model_25'),
('SN599252',1,'OEM_1','Model_21'),
('SN604779',0,'OEM_12','Model_26'),
('SN611035',1,'OEM_44','Model_15'),
('SN615180',0,'OEM_88','Model_2'),
('SN671909',1,'OEM_94','Model_48'),
('SN67890A1',1,'OEM Tech Co.','Model Phi'),
('SN67890B2',0,'OEM Innovations','Model Chi'),
('SN67890C3',1,'OEM Global','Model Psi'),
('SN67890D4',1,'OEM Enterprises','Model Omega'),
('SN67890E5',0,'OEM Solutions','Model AlphaX'),
('SN67890F6',1,'OEM Tech Co.','Model BetaX'),
('SN67890G7',0,'OEM Innovations','Model GammaX'),
('SN67890H8',1,'OEM Global','Model DeltaX'),
('SN67890I9',1,'OEM Enterprises','Model EpsilonX'),
('SN67890J0',0,'OEM Solutions','Model ZetaX'),
('SN735932',1,'OEM_84','Model_21'),
('SN764447',0,'OEM_23','Model_13'),
('SN784229',1,'OEM_71','Model_37'),
('SN866425',0,'OEM_27','Model_42'),
('SN867783',0,'OEM_70','Model_7'),
('SN900706',1,'OEM_59','Model_20'),
('SN905102',1,'OEM_38','Model_3'),
('SN910953',0,'OEM_70','Model_3'),
('SN921213',0,'OEM_77','Model_28'),
('SN934142',1,'OEM_21','Model_2'),
('SN934245',0,'OEM_17','Model_14'),
('SN979622',0,'OEM_29','Model_25'),
('SN98765A1',1,'OEM Tech Co.','Model EtaX'),
('SN98765B2',1,'OEM Innovations','Model ThetaX'),
('SN98765C3',0,'OEM Global','Model IotaX'),
('SN98765D4',1,'OEM Enterprises','Model KappaX'),
('SN98765E5',0,'OEM Solutions','Model LambdaX'),
('SN98765F6',1,'OEM Tech Co.','Model MuX'),
('SN98765G7',0,'OEM Innovations','Model NuX'),
('SN98765H8',1,'OEM Global','Model XiX'),
('SN98765I9',1,'OEM Enterprises','Model OmicronX'),
('SN98765J0',0,'OEM Solutions','Model PiX'),
('SN993720',0,'OEM_48','Model_6'),
('SN996369',0,'OEM_37','Model_21');
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FaultCode`
--

LOCK TABLES `FaultCode` WRITE;
/*!40000 ALTER TABLE `FaultCode` DISABLE KEYS */;
INSERT INTO `FaultCode` VALUES
(1,'7','7','7','7','7','7','0007-07-07 13:43:36.000',0,101),
(2,'E001','Error de comunicación','Severe','40','C','Sensor1','2024-11-13 12:00:00.000',1,1),
(3,'E002','Sobrecarga detectada','Warning','50','C','Sensor2','2024-11-14 08:00:00.000',1,8),
(4,'E003','Falla en el motor','Critical','65','C','Motor','2024-11-15 14:00:00.000',1,81),
(5,'E004','Error en el sistema de frenos','Critical','55','C','Sensor3','2024-11-16 09:30:00.000',1,9),
(6,'E005','Desviación de temperatura','Warning','45','C','Sensor4','2024-11-17 07:45:00.000',1,10),
(7,'E006','Error en válvula','Severe','60','C','Valve1','2024-11-18 17:15:00.000',1,102),
(8,'E007','Pérdida de presión','Critical','42','C','Sensor5','2024-11-19 06:00:00.000',1,103),
(9,'E008','Fallo en sistema eléctrico','Severe','48','C','Electric1','2024-11-20 10:30:00.000',1,104),
(10,'E009','Sobrecarga detectada','Warning','52','C','Sensor6','2024-11-21 13:45:00.000',1,105),
(11,'E010','Error desconocido','Critical','70','C','System','2024-11-22 16:00:00.000',1,106),
(12,'E011','Fallo en refrigeración','Severe','33','C','Cooling','2024-11-13 14:30:00.000',1,107),
(13,'E012','Error de calibración','Warning','36','C','Calibrator','2024-11-15 11:45:00.000',1,108),
(14,'E013','Fuga detectada','Critical','41','C','Sensor7','2024-11-18 08:15:00.000',1,109),
(15,'E014','Corte de energía','Severe','NA','NA','Power','2024-11-20 18:00:00.000',1,110),
(16,'E015','Error en unidad de control','Critical','50','C','Control1','2024-11-22 08:30:00.000',1,111),
(17,'E016','Error en sensores de torque','Warning','60','C','Torque','2024-11-13 11:00:00.000',1,11),
(18,'E017','Falla en válvulas hidráulicas','Severe','57','C','Hydraulic','2024-11-14 09:15:00.000',1,134),
(19,'E018','Error en flujo de aire','Critical','40','C','Airflow','2024-11-16 20:45:00.000',1,133),
(20,'E019','Problema en transmisión','Severe','49','C','Transmission','2024-11-17 16:30:00.000',1,131),
(21,'E020','Desgaste detectado','Warning','43','C','Sensor8','2024-11-19 15:45:00.000',1,132),
(22,'E021','Error en sistema hidráulico','Critical','70','C','Hydraulic','2024-11-20 13:00:00.000',1,124),
(23,'E022;--','Fallo en fuente de alimentación','Severe','-500000','dfhd','Power','2024-11-30 20:24:00.000',1,113),
(24,'E023','Sobrecarga detectada','Warning','55','C','Sensor9','2024-11-23 07:30:00.000',1,117),
(25,'E024','Fallo de comunicación','Severe','45','C','Sensor10','2024-11-14 17:30:00.000',1,136),
(26,'E025','Fuga detectada','Critical','65','C','Sensor11','2024-11-16 18:00:00.000',1,125),
(27,'E026','Fallo en circuito interno','Severe','50','C','Electric2','2024-11-18 10:15:00.000',1,127),
(28,'E027','Problema en el sistema de enfriamiento','Warning','36','C','Cooling2','2024-11-20 19:45:00.000',1,121),
(29,'E028','Error en válvula de presión','Severe','70','C','Valve2','2024-11-22 22:00:00.000',1,128),
(30,'E029','Fallo en sensor de velocidad','Critical','42','C','Speed','2024-11-23 05:30:00.000',1,122),
(31,'E030','Desviación de parámetros','Warning','60','C','Sensor12','2024-11-24 10:15:00.000',1,123);
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FuelRemaining`
--

LOCK TABLES `FuelRemaining` WRITE;
/*!40000 ALTER TABLE `FuelRemaining` DISABLE KEYS */;
INSERT INTO `FuelRemaining` VALUES
(1,75.5,'2024-10-01 08:15:20.123',1,1),
(2,80,'2024-10-01 10:30:45.456',1,2),
(3,65.2,'2024-10-02 12:45:15.789',0,3),
(4,50,'2024-10-03 09:10:10.321',1,4),
(5,40.8,'2024-10-03 14:55:50.654',0,5),
(6,35.6,'2024-10-04 16:30:22.987',1,6),
(7,90,'2024-10-05 08:40:59.432',1,7),
(8,82.3,'2024-10-06 12:15:45.210',0,8),
(9,75.8,'2024-10-06 14:50:33.543',1,9),
(10,60.2,'2024-10-07 17:35:18.876',1,10),
(11,95,'2024-10-08 08:25:10.159',0,1),
(12,88.5,'2024-10-08 11:10:40.567',1,2),
(13,70.7,'2024-10-09 13:20:55.890',1,3),
(14,55.6,'2024-10-09 16:45:50.456',0,4),
(15,60,'2024-10-10 10:30:30.123',1,5),
(16,72.4,'2024-10-11 08:15:18.678',1,6),
(17,85.2,'2024-10-11 12:45:55.987',0,7),
(18,50.3,'2024-10-12 09:50:45.543',1,8),
(19,40.5,'2024-10-13 15:25:33.654',0,9),
(20,30.8,'2024-10-14 08:55:50.876',1,10),
(21,92.1,'2024-10-14 11:10:22.210',1,1),
(22,80,'2024-10-15 15:30:40.432',0,2),
(23,65,'2024-10-16 10:20:15.123',1,3),
(24,55.5,'2024-10-17 14:40:22.567',1,4),
(25,48.3,'2024-10-18 16:15:33.987',0,5),
(26,72,'2024-10-19 09:10:40.159',1,6),
(27,68.7,'2024-10-20 10:25:10.456',0,7),
(28,82.6,'2024-10-21 12:50:33.654',1,8),
(29,60.9,'2024-10-22 15:10:55.890',0,9),
(30,30,'2024-10-23 18:00:45.543',0,10),
(31,10,'2025-11-04 19:01:00.000',0,64);
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
) ENGINE=InnoDB AUTO_INCREMENT=178 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FuelUsed`
--

LOCK TABLES `FuelUsed` WRITE;
/*!40000 ALTER TABLE `FuelUsed` DISABLE KEYS */;
INSERT INTO `FuelUsed` VALUES
(1,120,'2024-10-01 08:30:15.123','liters',1,1),
(2,75,'2024-10-02 10:45:22.456','gallons',1,2),
(3,250,'2024-10-03 12:15:33.789','liters',0,3),
(4,300,'2024-10-04 14:20:10.321','gallons',1,4),
(5,180,'2024-10-05 09:10:05.654','liters',0,5),
(6,220,'2024-10-06 11:40:30.987','gallons',1,6),
(7,95,'2024-10-07 13:50:55.432','liters',1,7),
(8,400,'2024-10-08 16:25:45.210','gallons',0,8),
(9,275,'2024-10-09 10:10:50.543','liters',1,9),
(10,150,'2024-10-10 12:30:18.876','gallons',1,10),
(11,320,'2024-10-11 14:00:22.159','liters',0,1),
(12,210,'2024-10-12 16:40:40.567','gallons',1,2),
(13,310,'2024-10-13 18:55:10.890','liters',1,3),
(14,60,'2024-10-14 08:30:20.456','gallons',0,4),
(15,400,'2024-10-15 11:45:33.123','liters',1,5),
(16,290,'2024-10-16 15:10:59.678','gallons',1,6),
(17,340,'2024-10-17 17:35:15.987','liters',0,7),
(18,200,'2024-10-18 10:20:50.543','gallons',1,8),
(19,370,'2024-10-19 12:45:33.654','liters',0,9),
(20,80,'2024-10-20 14:30:10.876','gallons',1,10),
(21,425,'2024-10-21 09:50:15.210','liters',1,1),
(22,280,'2024-10-22 13:40:22.432','gallons',0,2),
(23,195,'2024-10-23 15:55:33.123','liters',1,3),
(24,310,'2024-10-24 10:20:45.567','gallons',1,4),
(25,180,'2024-10-25 14:15:18.987','liters',0,5),
(26,210,'2024-10-26 16:30:10.159','gallons',1,6),
(27,125,'2024-10-27 08:40:33.456','liters',0,7),
(28,150,'2024-10-28 11:50:22.654','gallons',1,8),
(29,270,'2024-10-29 14:30:45.890','liters',0,9),
(30,300,'2024-10-30 17:00:50.543','gallons',0,10),
(31,120,'2024-10-01 08:30:15.123','liters',1,1),
(32,75,'2024-10-02 10:45:22.456','gallons',1,2),
(33,250,'2024-10-03 12:15:33.789','liters',0,3),
(34,300,'2024-10-04 14:20:10.321','gallons',1,4),
(35,180,'2024-10-05 09:10:05.654','liters',0,5),
(36,220,'2024-10-06 11:40:30.987','gallons',1,6),
(37,95,'2024-10-07 13:50:55.432','liters',1,7),
(38,400,'2024-10-08 16:25:45.210','gallons',0,8),
(39,275,'2024-10-09 10:10:50.543','liters',1,9),
(40,150,'2024-10-10 12:30:18.876','gallons',1,10),
(41,320,'2024-10-11 14:00:22.159','liters',0,1),
(42,210,'2024-10-12 16:40:40.567','gallons',1,2),
(43,310,'2024-10-13 18:55:10.890','liters',1,3),
(44,60,'2024-10-14 08:30:20.456','gallons',0,4),
(45,400,'2024-10-15 11:45:33.123','liters',1,5),
(46,290,'2024-10-16 15:10:59.678','gallons',1,6),
(47,340,'2024-10-17 17:35:15.987','liters',0,7),
(48,200,'2024-10-18 10:20:50.543','gallons',1,8),
(49,370,'2024-10-19 12:45:33.654','liters',0,9),
(50,80,'2024-10-20 14:30:10.876','gallons',1,10),
(51,425,'2024-10-21 09:50:15.210','liters',1,1),
(52,280,'2024-10-22 13:40:22.432','gallons',0,2),
(53,195,'2024-10-23 15:55:33.123','liters',1,3),
(54,310,'2024-10-24 10:20:45.567','gallons',1,4),
(55,180,'2024-10-25 14:15:18.987','liters',0,5),
(56,210,'2024-10-26 16:30:10.159','gallons',1,6),
(57,125,'2024-10-27 08:40:33.456','liters',0,7),
(58,150,'2024-10-28 11:50:22.654','gallons',1,8),
(59,270,'2024-10-29 14:30:45.890','liters',1,9),
(60,300,'2024-10-30 17:00:50.543','gallons',0,10),
(61,120,'2024-10-01 08:15:20.123','liters',1,1),
(62,75,'2024-10-01 10:30:45.456','gallons',1,2),
(63,200,'2024-10-02 12:45:15.789','liters',0,3),
(64,300,'2024-10-03 09:10:10.321','gallons',1,4),
(65,150,'2024-10-03 14:55:50.654','liters',0,5),
(66,250,'2024-10-04 16:30:22.987','gallons',1,6),
(67,90,'2024-10-05 08:40:59.432','liters',1,7),
(68,400,'2024-10-06 12:15:45.210','gallons',0,8),
(69,180,'2024-10-06 14:50:33.543','liters',1,9),
(70,275,'2024-10-07 17:35:18.876','gallons',1,10),
(71,320,'2024-10-08 08:25:10.159','liters',0,1),
(72,220,'2024-10-08 11:10:40.567','gallons',1,2),
(73,310,'2024-10-09 13:20:55.890','liters',1,3),
(74,65,'2024-10-09 16:45:50.456','gallons',0,4),
(75,400,'2024-10-10 10:30:30.123','liters',1,5),
(76,280,'2024-10-11 08:15:18.678','gallons',1,6),
(77,350,'2024-10-11 12:45:55.987','liters',0,7),
(78,200,'2024-10-12 09:50:45.543','gallons',1,8),
(79,360,'2024-10-13 15:25:33.654','liters',0,9),
(80,80,'2024-10-14 08:55:50.876','gallons',1,10),
(81,425,'2024-10-14 11:10:22.210','liters',1,1),
(82,290,'2024-10-15 15:30:40.432','gallons',0,2),
(83,190,'2024-10-16 10:20:15.123','liters',1,3),
(84,310,'2024-10-17 14:40:22.567','gallons',1,4),
(85,185,'2024-10-18 16:15:33.987','liters',0,5),
(86,210,'2024-10-19 09:10:40.159','gallons',1,6),
(87,135,'2024-10-20 10:25:10.456','liters',0,7),
(88,150,'2024-10-21 12:50:33.654','gallons',1,8),
(89,270,'2024-10-22 15:10:55.890','liters',1,9),
(90,300,'2024-10-23 18:00:45.543','gallons',0,10),
(91,300,'2025-11-12 22:00:00.000','litros',0,81),
(92,500,'2024-11-22 10:00:00.000','liters',1,112),
(93,550,'2024-11-22 11:00:00.000','liters',1,112),
(94,600,'2024-11-22 12:00:00.000','liters',1,112),
(95,600,'2024-11-22 13:00:00.000','liters',1,113),
(96,650,'2024-11-22 14:00:00.000','liters',1,113),
(97,700,'2024-11-22 15:00:00.000','liters',1,113),
(98,800,'2024-11-22 14:00:00.000','liters',1,113),
(99,850,'2024-11-22 15:00:00.000','liters',1,113),
(100,900,'2024-11-22 16:00:00.000','liters',1,113),
(101,1000,'2024-11-22 15:00:00.000','liters',1,113),
(102,1050,'2024-11-22 16:00:00.000','liters',1,113),
(103,1100,'2024-11-22 17:00:00.000','liters',1,113),
(104,1200,'2024-11-22 16:00:00.000','liters',1,113),
(105,1250,'2024-11-22 17:00:00.000','liters',1,113),
(106,1300,'2024-11-22 18:00:00.000','liters',1,113),
(107,800,'2024-11-22 17:00:00.000','liters',1,117),
(108,850,'2024-11-22 18:00:00.000','liters',1,117),
(109,900,'2024-11-22 19:00:00.000','liters',1,117),
(110,950,'2024-11-22 18:00:00.000','liters',1,117),
(111,1000,'2024-11-22 19:00:00.000','liters',1,117),
(112,1050,'2024-11-22 20:00:00.000','liters',1,117),
(113,1100,'2024-11-22 19:00:00.000','liters',1,117),
(114,1150,'2024-11-22 20:00:00.000','liters',1,117),
(115,1200,'2024-11-22 21:00:00.000','liters',1,117),
(116,2000,'2024-11-23 03:00:00.000','liters',1,127),
(117,2100,'2024-11-23 04:00:00.000','liters',1,127),
(118,2200,'2024-11-23 05:00:00.000','liters',1,127),
(119,2300,'2024-11-23 04:00:00.000','liters',1,127),
(120,2400,'2024-11-23 05:00:00.000','liters',1,127),
(121,2500,'2024-11-23 06:00:00.000','liters',1,127),
(122,2600,'2024-11-23 05:00:00.000','liters',1,127),
(123,2700,'2024-11-23 06:00:00.000','liters',1,127),
(124,2800,'2024-11-23 07:00:00.000','liters',1,127),
(125,2000,'2024-11-23 03:00:00.000','liters',1,1),
(126,2100,'2024-11-23 04:00:00.000','liters',1,1),
(127,2200,'2024-11-23 05:00:00.000','liters',1,1),
(128,2300,'2024-11-23 04:00:00.000','liters',1,2),
(129,2400,'2024-11-23 05:00:00.000','liters',1,2),
(130,2500,'2024-11-23 06:00:00.000','liters',1,2),
(131,2600,'2024-11-23 05:00:00.000','liters',1,3),
(132,2700,'2024-11-23 06:00:00.000','liters',1,3),
(133,2800,'2024-11-23 07:00:00.000','liters',1,3),
(134,2900,'2024-11-23 06:00:00.000','liters',1,4),
(135,3000,'2024-11-23 07:00:00.000','liters',1,4),
(136,3100,'2024-11-23 08:00:00.000','liters',1,4),
(137,3200,'2024-11-23 07:00:00.000','liters',1,5),
(138,3300,'2024-11-23 08:00:00.000','liters',1,5),
(139,3400,'2024-11-23 09:00:00.000','liters',1,5),
(140,3500,'2024-11-23 08:00:00.000','liters',1,6),
(141,3600,'2024-11-23 09:00:00.000','liters',1,6),
(142,3700,'2024-11-23 10:00:00.000','liters',1,6),
(143,3800,'2024-11-23 09:00:00.000','liters',1,7),
(144,3900,'2024-11-23 10:00:00.000','liters',1,7),
(145,4000,'2024-11-23 11:00:00.000','liters',1,7),
(146,4100,'2024-11-23 10:00:00.000','liters',1,8),
(147,4200,'2024-11-23 11:00:00.000','liters',1,8),
(148,4300,'2024-11-23 12:00:00.000','liters',1,8),
(149,4400,'2024-11-23 11:00:00.000','liters',1,9),
(150,4500,'2024-11-23 12:00:00.000','liters',1,9),
(151,4600,'2024-11-23 13:00:00.000','liters',1,9),
(152,4700,'2024-11-23 12:00:00.000','liters',1,10),
(153,4800,'2024-11-23 13:00:00.000','liters',1,10),
(154,4900,'2024-11-23 14:00:00.000','liters',1,10),
(155,498,'2024-11-22 10:02:45.000','Litros',1,147),
(156,390,'2024-11-22 10:02:45.000','Litros',1,148),
(157,455,'2024-11-22 10:02:45.000','Litros',1,149),
(158,106,'2024-11-22 10:02:45.000','Litros',1,150),
(159,165,'2024-11-22 10:02:45.000','Litros',1,151),
(160,5,'2024-11-22 10:02:45.000','Litros',1,152),
(161,30,'2024-11-22 10:02:45.000','Litros',1,153),
(162,136,'2024-11-22 10:02:45.000','Litros',1,154),
(163,88,'2024-11-22 10:02:45.000','Litros',1,155),
(164,34,'2024-11-22 10:02:45.000','Litros',1,156),
(165,404,'2024-11-22 10:02:45.000','Litros',1,157),
(166,418,'2024-11-22 10:02:45.000','Litros',1,158),
(167,379,'2024-11-22 10:02:45.000','Litros',1,159),
(168,139,'2024-11-22 10:02:45.000','Litros',1,160),
(169,59,'2024-11-22 10:02:45.000','Litros',1,161),
(170,380,'2024-11-22 10:02:45.000','Litros',1,162),
(171,223,'2024-11-22 10:02:45.000','Litros',1,163),
(172,472,'2024-11-22 10:02:45.000','Litros',1,164),
(173,193,'2024-11-22 10:02:45.000','Litros',1,165),
(174,47,'2024-11-22 10:02:45.000','Litros',1,166),
(175,333,'2024-11-22 11:05:00.000','litros',1,171),
(176,5,'2024-11-21 09:02:00.000','galones',1,172),
(177,5,'2025-11-28 09:02:00.000','galones',0,173);
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
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FuelUsedLast24`
--

LOCK TABLES `FuelUsedLast24` WRITE;
/*!40000 ALTER TABLE `FuelUsedLast24` DISABLE KEYS */;
INSERT INTO `FuelUsedLast24` VALUES
(1,120,'2024-10-01 08:15:20.123','liters',1,1),
(2,75,'2024-10-01 10:30:45.456','gallons',1,2),
(3,200,'2024-10-02 12:45:15.789','liters',0,3),
(4,300,'2024-10-03 09:10:10.321','gallons',1,4),
(5,150,'2024-10-03 14:55:50.654','liters',0,5),
(6,250,'2024-10-04 16:30:22.987','gallons',1,6),
(7,90,'2024-10-05 08:40:59.432','liters',1,7),
(8,400,'2024-10-06 12:15:45.210','gallons',0,8),
(9,180,'2024-10-06 14:50:33.543','liters',1,9),
(10,275,'2024-10-07 17:35:18.876','gallons',1,10),
(11,320,'2024-10-08 08:25:10.159','liters',0,1),
(12,220,'2024-10-08 11:10:40.567','gallons',1,2),
(13,310,'2024-10-09 13:20:55.890','liters',1,3),
(14,65,'2024-10-09 16:45:50.456','gallons',0,4),
(15,400,'2024-10-10 10:30:30.123','liters',1,5),
(16,280,'2024-10-11 08:15:18.678','gallons',1,6),
(17,350,'2024-10-11 12:45:55.987','liters',0,7),
(18,200,'2024-10-12 09:50:45.543','gallons',1,8),
(19,360,'2024-10-13 15:25:33.654','liters',0,9),
(20,80,'2024-10-14 08:55:50.876','gallons',1,10),
(21,425,'2024-10-14 11:10:22.210','liters',1,1),
(22,290,'2024-10-15 15:30:40.432','gallons',0,2),
(23,190,'2024-10-16 10:20:15.123','liters',1,3),
(24,310,'2024-10-17 14:40:22.567','gallons',1,4),
(25,185,'2024-10-18 16:15:33.987','liters',0,5),
(26,210,'2024-10-19 09:10:40.159','gallons',1,6),
(27,135,'2024-10-20 10:25:10.456','liters',0,7),
(28,150,'2024-10-21 12:50:33.654','gallons',1,8),
(29,270,'2024-10-22 15:10:55.890','liters',1,9),
(30,300,'2024-10-23 18:00:45.543','gallons',0,10),
(31,120,'2024-10-01 08:15:20.123','liters',1,1),
(32,75,'2024-10-01 10:30:45.456','gallons',1,2),
(33,200,'2024-10-02 12:45:15.789','liters',0,3),
(34,300,'2024-10-03 09:10:10.321','gallons',1,4),
(35,150,'2024-10-03 14:55:50.654','liters',0,5),
(36,250,'2024-10-04 16:30:22.987','gallons',1,6),
(37,90,'2024-10-05 08:40:59.432','liters',1,7),
(38,400,'2024-10-06 12:15:45.210','gallons',0,8),
(39,180,'2024-10-06 14:50:33.543','liters',1,9),
(40,275,'2024-10-07 17:35:18.876','gallons',1,10),
(41,320,'2024-10-08 08:25:10.159','liters',0,1),
(42,220,'2024-10-08 11:10:40.567','gallons',1,2),
(43,310,'2024-10-09 13:20:55.890','liters',1,3),
(44,65,'2024-10-09 16:45:50.456','gallons',0,4),
(45,400,'2024-10-10 10:30:30.123','liters',1,5),
(46,280,'2024-10-11 08:15:18.678','gallons',1,6),
(47,350,'2024-10-11 12:45:55.987','liters',0,7),
(48,200,'2024-10-12 09:50:45.543','gallons',1,8),
(49,360,'2024-10-13 15:25:33.654','liters',0,9),
(50,80,'2024-10-14 08:55:50.876','gallons',1,10),
(51,425,'2024-10-14 11:10:22.210','liters',1,1),
(52,290,'2024-10-15 15:30:40.432','gallons',0,2),
(53,190,'2024-10-16 10:20:15.123','liters',1,3),
(54,310,'2024-10-17 14:40:22.567','gallons',1,4),
(55,185,'2024-10-18 16:15:33.987','liters',0,5),
(56,210,'2024-10-19 09:10:40.159','gallons',1,6),
(57,135,'2024-10-20 10:25:10.456','liters',0,7),
(58,150,'2024-10-21 12:50:33.654','gallons',1,8),
(59,270,'2024-10-22 15:10:55.890','liters',1,9),
(60,300,'2024-10-23 18:00:45.543','gallons',0,10);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Location`
--

LOCK TABLES `Location` WRITE;
/*!40000 ALTER TABLE `Location` DISABLE KEYS */;
INSERT INTO `Location` VALUES
(1,2,2,22,'b',1,'2024-12-06 19:02:00.000',0,57),
(2,2,2,2,'metros',0,'2024-11-27 08:02:00.000',0,169);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES
(1,'Omar Roman Salinas','rubenor','1234','ADMIN',0,'rsro220228@upemor.edu.mx'),
(2,'Omar Roman Salinas','rubenor','1234','ADMIN',1,'rsro220228@upemor.edu.mx'),
(3,'Omar Roman Salinas','rubenor','1234','ADMIN',1,'rsro220228@upemor.edu.mx'),
(4,'Omar Roman','rubenora','12345','ADMIN',1,'omar.roman.2828@gmail.com');
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
('41d79a2e-e731-44d1-9402-b8c70164dcfc','b66755b1401c7e93ad7e9dd91a920bb6dc9e6e6cde5b6c50207ce710013c691c','2024-11-12 02:25:16.569','20241112022516_prueba',NULL,NULL,'2024-11-12 02:25:16.228',1);
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

-- Dump completed on 2024-11-23  8:33:48
