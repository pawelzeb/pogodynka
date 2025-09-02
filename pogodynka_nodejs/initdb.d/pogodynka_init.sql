-- MariaDB dump 10.19  Distrib 10.4.24-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: pogodynka
-- ------------------------------------------------------
-- Server version	10.4.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lon` float DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `cc` varchar(5) DEFAULT "pl",
  `timezone_offset` int(11) DEFAULT NULL,
  `follow` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `weather_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `weather_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city_id` int(11) DEFAULT NULL,
  `dt` int(11) DEFAULT NULL,
  `icon` varchar(20) DEFAULT NULL,
  `main_weather` varchar(50) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `temp` float DEFAULT NULL,
  `temp_min` float DEFAULT NULL,
  `temp_max` float DEFAULT NULL,
  `humidity` int(11) DEFAULT NULL,
  `pressure` int(11) DEFAULT NULL,
  `cloud_cover` int(11) DEFAULT NULL,
  `wind_speed` float DEFAULT NULL,
  `wind_deg` int(11) DEFAULT NULL,
  `sun_rise` int(11) DEFAULT NULL,
  `sun_set` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `city_id` (`city_id`),
  CONSTRAINT `weather_data_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

