CREATE DATABASE  IF NOT EXISTS `competition_system_security_concept_v2_db` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `competition_system_security_concept_v2_db`;
-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: competition_system_security_concept_v2_db
-- ------------------------------------------------------
-- Server version	8.0.25

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
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `cloudinary_file_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `cloudinary_url` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `design_title` varchar(2000) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `design_description` varchar(2000) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES (100,'Design/hbukmdugiatdbmgobrdq','http://res.cloudinary.com/wongwj/image/upload/v1622636039/Design/hbukmdugiatdbmgobrdq.png','rita design 1','rita design 1 description text 1 text 2 text 3 text 4 ....',100),(101,'Design/jecbaawpweki0ru0dq2c','http://res.cloudinary.com/wongwj/image/upload/v1622636041/Design/jecbaawpweki0ru0dq2c.png','rita design 2','rita design 2 description text 1 text 2 text 3 text 4 ....',100),(102,'Design/bjwejl9alijhcvzgdrre','http://res.cloudinary.com/wongwj/image/upload/v1622636043/Design/bjwejl9alijhcvzgdrre.png','rita design 3','rita design 3 description text 1 text 2 text 3 text 4 ....',100),(103,'Design/hinkgxzmcluzieqabdmf','http://res.cloudinary.com/wongwj/image/upload/v1622636044/Design/hinkgxzmcluzieqabdmf.png','rita design 4','rita design 4 description text 1 text 2 text 3 text 4 ....',100),(104,'Design/kwjkdgf4rfbw1j4a1bj2','http://res.cloudinary.com/wongwj/image/upload/v1622636046/Design/kwjkdgf4rfbw1j4a1bj2.png','rita design 5','rita design 5 description text 1 text 2 text 3 text 4 ....',100),(105,'Design/gttdb6yd5qeqqaiansvp','http://res.cloudinary.com/wongwj/image/upload/v1622636048/Design/gttdb6yd5qeqqaiansvp.png','rita design 6','rita design 6 description text 1 text 2 text 3 text 4 ....',100),(106,'Design/wul3xphulzmz6ekk8j68','http://res.cloudinary.com/wongwj/image/upload/v1622636049/Design/wul3xphulzmz6ekk8j68.png','rita design 7','rita design 7 description text 1 text 2 text 3 text 4 ....',100),(107,'Design/dlihtck8cimouxg7hxwl','http://res.cloudinary.com/wongwj/image/upload/v1622636051/Design/dlihtck8cimouxg7hxwl.png','rita design 8','rita design 8 description text 1 text 2 text 3 text 4 ....',100),(108,'Design/pb0r2sbqegtkxbv6gbvj','http://res.cloudinary.com/wongwj/image/upload/v1622636053/Design/pb0r2sbqegtkxbv6gbvj.png','rita design 9','rita design 9 description text 1 text 2 text 3 text 4 ....',100),(109,'Design/co96nxfvggp43waomrms','http://res.cloudinary.com/wongwj/image/upload/v1622636054/Design/co96nxfvggp43waomrms.png','rita design 10','rita design 10 description text 1 text 2 text 3 text 4 ....',100),(110,'Design/jwxgo5fikjwdwdr3ma9t','http://res.cloudinary.com/wongwj/image/upload/v1622636056/Design/jwxgo5fikjwdwdr3ma9t.png','rita design 11','rita design 11 description text 1 text 2 text 3 text 4 ....',100),(111,'Design/oxkkumijs08rvq3wv8on','http://res.cloudinary.com/wongwj/image/upload/v1622636058/Design/oxkkumijs08rvq3wv8on.png','rita design 12','rita design 12 description text 1 text 2 text 3 text 4 ....',100),(112,'Design/alyphhtik9sossk6cngo','http://res.cloudinary.com/wongwj/image/upload/v1622637862/Design/alyphhtik9sossk6cngo.png','Bob Design 1','Bob Design Description 1',102),(115,'Design/smuryoptiwbgraam2zs1','http://res.cloudinary.com/wongwj/image/upload/v1624195351/Design/smuryoptiwbgraam2zs1.png','Bob Design 2','Bob Design 2 Description',102),(117,'Design/r5emil6krvlsztjo5osj','http://res.cloudinary.com/wongwj/image/upload/v1624195756/Design/r5emil6krvlsztjo5osj.png','Bob Design 3','Bob Design Description 3',102),(118,'Design/ijojg07t2caosy6bfpbg','http://res.cloudinary.com/wongwj/image/upload/v1624196112/Design/ijojg07t2caosy6bfpbg.png','!','!',102),(119,'Design/tnvgbeghdurlx4m1sftn','http://res.cloudinary.com/wongwj/image/upload/v1624366049/Design/tnvgbeghdurlx4m1sftn.png','Bob Design 6','Details',102),(120,'Design/thkrmtdtjjwgstvge45f','http://res.cloudinary.com/wongwj/image/upload/v1624800246/Design/thkrmtdtjjwgstvge45f.png','Test','Test',157);
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'admin'),(2,'user');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `user_password` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (100,'rita','rita@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(101,'robert','robert@admin.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',1),(102,'bob','bob@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(103,'braddy','braddy@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(104,'josh','josh@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(105,'john','john@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(106,'fred','fred@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(107,'ashley','ashley@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(108,'amy','amy@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(109,'anita','anita@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(110,'eddy','eddy@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(111,'larry','larry@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(112,'ahtan','ahtan@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(113,'joe','joe@admin.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(114,'gabby','gabby@designer.com','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6',2),(140,'ewrwrwer','erwrwer@wewe.wewe','$2b$10$csEQVzdRDGM4t.eOMUJ3NOqQqecsOBPQ0zFr0RVjyV4jO3SAwcgqW',2),(141,'Test','test@test.com','$2b$10$oEodoR2DY4q4O6Jdb2lsyu.FakyL33bTTZbkfkVkr44dVZvuvCelW',2),(142,'hashtest','hashtest@gmail.com','$2b$10$sf.AHTWCsRJCS1N7AQs2E.fan0BOCk1Y2/UNYICsXSOfD9WxtyMZC',2),(144,'hashtest2','hashtest2@gmail.com','$2b$10$4F/M6zw9Q93ir5AISC6wUekCYJKtRDzDh4Weh7vmjHTbnVEk3R6cC',2),(145,'hashtest3','hashtest3@gmail.com','$2b$10$PbZ2dQlkxHUBapVmsjO.xeEDN/p40kzPQ5L5SOc38MPdH6O292Fc6',2),(146,'hashtest4','hashtest4@test.com','$2b$10$s0/4qiE4dcGWz.mOBpbhT.PEPWKt4rYw/A6So0bIpDxz6NWXy7kqi',2),(147,'hashtest5','hashtest5@test.com','$2b$10$fJ1H42rwNJT//ELALOq7Zegp6KqgT/YDYmpbbhSiWYG3QCB1zdsae',2),(148,'hashtest6','hashtest6@test.com','$2b$10$pDjMQ4uYTawn40pUtbmqn.jauK/h047.FaDI28/h2GNYjTRg9xRZa',2),(149,'hashtest7','hashtest7@test.com','$2b$10$aQeAdkCBh.60s8oD6XttH.HTy2rcKt1bjkw5TAJid8fxnd3PbSwq6',2),(150,'hashtest8','hashtest8@test.com','$2b$10$OhCKYqA8nmMfDmSfOqXAjO7dRbJ4/oJkP7O4C3i76qVOcPnAsm1bi',2),(151,'hashtest8','hashtest9@test.com','$2b$10$pwAQ.OY3cy6QPLO1pRNGMeaOafJzmZm4D5NoxFQ0X7vm6otWgRSGC',2),(152,'hashtest9','hashtest9@gmail.com','$2b$10$WmSIE9B/uG2CxdwXJubUz.LQhDNytXeZVIHvdD4eWhS5BtPz3y/bu',2),(153,'hashtest10','hashtest10@gmail.com','$2b$10$wugeCnj7hFmS9eLJAQq8luBVJGUbT/yyKR5YmqZqzG4yuWgSIYsZ.',2),(157,'WongWJ','wwj051102@gmail.com','$2b$10$Tn5IjsOII8zz0WtKOxiOPOdynHN771OuFt3ipWz/Z5Xv.gTV.87ra',2);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-27 21:35:52
