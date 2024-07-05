-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 27, 2024 at 10:29 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `valudas`
--

-- --------------------------------------------------------

--
-- Table structure for table `portfolio`
--

CREATE TABLE `portfolio` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `thumbnail` varchar(500) NOT NULL,
  `service_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `portfolio`
--

INSERT INTO `portfolio` (`id`, `title`, `description`, `thumbnail`, `service_id`) VALUES
(168, 'anas', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '1719233864501_mearn_stac.jpg', 79),
(169, 'ahmaddd', 'asdhhhhh', '1719296136877_Maskgroupbaby.png', 80),
(171, 'welcomm', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '1719297311056_download.jpg', 85);

-- --------------------------------------------------------

--
-- Table structure for table `portfolio_img`
--

CREATE TABLE `portfolio_img` (
  `id` int(11) NOT NULL,
  `image` varchar(500) NOT NULL,
  `portfolio_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `id` int(11) NOT NULL,
  `service_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`id`, `service_name`) VALUES
(45, 'WEB DESIGNING'),
(46, 'MERN STACK'),
(73, 'CMS'),
(74, 'WEB DEVLOPMENT'),
(75, 'CMS'),
(76, 'CMS'),
(77, 'WEB DEVLOPMENT'),
(79, 'WEB DEVLOPMENT'),
(80, 'CMS'),
(85, 'MERN STACK'),
(88, 'MERN STACK');

-- --------------------------------------------------------

--
-- Table structure for table `service_tecnology`
--

CREATE TABLE `service_tecnology` (
  `id` int(200) NOT NULL,
  `service_id` int(11) NOT NULL,
  `tecnology_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_tecnology`
--

INSERT INTO `service_tecnology` (`id`, `service_id`, `tecnology_id`) VALUES
(255, 79, 18),
(256, 79, 19),
(257, 79, 20),
(260, 80, 24),
(261, 80, 26),
(307, 88, 17),
(308, 88, 18),
(309, 88, 19),
(310, 88, 20),
(311, 88, 21);

-- --------------------------------------------------------

--
-- Table structure for table `tecnology`
--

CREATE TABLE `tecnology` (
  `id` int(11) NOT NULL,
  `tecno_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tecnology`
--

INSERT INTO `tecnology` (`id`, `tecno_name`) VALUES
(17, 'HTML'),
(18, 'CSS'),
(19, 'REACT JS'),
(20, 'SQL'),
(21, 'NEXT JS'),
(24, 'hubsport'),
(26, 'wordpress'),
(28, 'figma');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `portfolio`
--
ALTER TABLE `portfolio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tecno_id` (`service_id`);

--
-- Indexes for table `portfolio_img`
--
ALTER TABLE `portfolio_img`
  ADD PRIMARY KEY (`id`),
  ADD KEY `portfolio_id` (`portfolio_id`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_tecnology`
--
ALTER TABLE `service_tecnology`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `tecnology_id` (`tecnology_id`);

--
-- Indexes for table `tecnology`
--
ALTER TABLE `tecnology`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `portfolio`
--
ALTER TABLE `portfolio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT for table `portfolio_img`
--
ALTER TABLE `portfolio_img`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `service_tecnology`
--
ALTER TABLE `service_tecnology`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=312;

--
-- AUTO_INCREMENT for table `tecnology`
--
ALTER TABLE `tecnology`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `portfolio`
--
ALTER TABLE `portfolio`
  ADD CONSTRAINT `portfolio_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`);

--
-- Constraints for table `portfolio_img`
--
ALTER TABLE `portfolio_img`
  ADD CONSTRAINT `portfolio_img_ibfk_1` FOREIGN KEY (`portfolio_id`) REFERENCES `portfolio` (`id`);

--
-- Constraints for table `service_tecnology`
--
ALTER TABLE `service_tecnology`
  ADD CONSTRAINT `service_tecnology_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`),
  ADD CONSTRAINT `service_tecnology_ibfk_2` FOREIGN KEY (`tecnology_id`) REFERENCES `tecnology` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
