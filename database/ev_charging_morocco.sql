-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 29 mai 2026 à 14:23
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ev_charging_morocco`
--

-- --------------------------------------------------------

--
-- Structure de la table `connections`
--

CREATE TABLE `connections` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `connection_type` varchar(255) DEFAULT NULL,
  `power_kw` double DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `voltage` int(11) DEFAULT NULL,
  `amps` int(11) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `current_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `connections`
--

INSERT INTO `connections` (`id`, `station_id`, `connection_type`, `power_kw`, `quantity`, `voltage`, `amps`, `level`, `current_type`) VALUES
(317, 471457, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(318, 471455, 'CCS (Type 2)', 50, 2, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(319, 471453, 'CCS (Type 2)', 50, 2, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(320, 460398, 'CCS (Type 2)', 180, 2, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(321, 460398, 'CCS (Type 2)', 40, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(322, 460244, 'CCS (Type 2)', 100, 2, 400, 200, 'Level 3:  High (Over 40kW)', 'DC'),
(323, 314010, 'CCS (Type 2)', 100, 2, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(324, 314010, 'Type 2 (Tethered Connector) ', 22, 1, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(325, 313957, 'CCS (Type 2)', 50, 2, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(326, 313956, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(327, 313956, 'Type 2 (Tethered Connector) ', 7, 4, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(328, 313652, 'CCS (Type 2)', 100, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(329, 313652, 'Type 2 (Tethered Connector) ', 22, 1, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(330, 312704, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(331, 312704, 'Type 2 (Tethered Connector) ', 43, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'AC (Three-Phase)'),
(332, 311791, 'Type 2 (Tethered Connector) ', 22, 1, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(333, 311621, 'Type 2 (Tethered Connector) ', 2, 1, NULL, NULL, 'Level 1 : Low (Under 2kW)', 'AC (Three-Phase)'),
(334, 311620, 'Type 2 (Tethered Connector) ', 22, 1, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(335, 311618, 'Type 2 (Tethered Connector) ', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(336, 311617, 'Type 2 (Tethered Connector) ', 22, 1, 400, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(337, 311616, 'Type 2 (Tethered Connector) ', 22, 2, 400, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(338, 311517, 'Type 2 (Tethered Connector) ', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(339, 311516, 'Type 2 (Tethered Connector) ', 11, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(340, 311515, 'Type 2 (Tethered Connector) ', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(341, 311514, 'Type 2 (Tethered Connector) ', 22, 4, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(342, 311513, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(343, 311513, 'CHAdeMO', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(344, 311512, 'Type 2 (Tethered Connector) ', 22, 4, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(345, 311511, 'Type 2 (Tethered Connector) ', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(346, 311510, 'Type 2 (Tethered Connector) ', 22, 3, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(347, 311468, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(348, 311468, 'CHAdeMO', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(349, 311467, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(350, 311467, 'CHAdeMO', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(351, 311467, 'Type 2 (Tethered Connector) ', 22, 1, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(352, 311412, 'Type 2 (Tethered Connector) ', 22, 2, 400, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(353, 311380, 'Type 2 (Tethered Connector) ', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(354, 311376, 'Type 2 (Tethered Connector) ', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(355, 311375, 'CCS (Type 2)', 240, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(356, 311375, 'Type 2 (Tethered Connector) ', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(357, 311375, 'CCS (Type 2)', 360, 3, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(358, 311374, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(359, 311374, 'Type 2 (Tethered Connector) ', 22, 1, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(360, 311372, 'Type 2 (Tethered Connector) ', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(361, 311371, 'Type 2 (Tethered Connector) ', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(362, 311370, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(363, 311370, 'Type 2 (Tethered Connector) ', 43, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'AC (Three-Phase)'),
(364, 311368, 'CCS (Type 2)', 100, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(365, 311368, 'Type 2 (Tethered Connector) ', 22, 1, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(366, 311367, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(367, 311367, 'CHAdeMO', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(368, 311367, 'Type 2 (Tethered Connector) ', 22, 1, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(369, 311366, 'Type 2 (Tethered Connector) ', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(370, 311365, 'Type 2 (Tethered Connector) ', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(371, 311364, 'Type 2 (Tethered Connector) ', 22, 2, 400, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(372, 311363, 'Type 2 (Tethered Connector) ', 22, 2, 400, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(373, 311362, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(374, 311362, 'Type 2 (Tethered Connector) ', 22, 1, 400, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(375, 311310, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(376, 311310, 'CHAdeMO', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(377, 311310, 'Type 2 (Tethered Connector) ', 22, 1, 400, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(378, 311309, 'CCS (Type 2)', 100, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(379, 311309, 'Type 2 (Tethered Connector) ', 22, 3, 400, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(380, 311307, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(381, 311307, 'Type 2 (Tethered Connector) ', 43, 1, 400, 63, 'Level 3:  High (Over 40kW)', 'AC (Three-Phase)'),
(382, 311306, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(383, 311306, 'Type 2 (Tethered Connector) ', 43, 1, 400, 63, 'Level 3:  High (Over 40kW)', 'AC (Three-Phase)'),
(384, 311298, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(385, 311298, 'Type 2 (Tethered Connector) ', 22, 1, 400, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(386, 311283, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(387, 311283, 'Type 2 (Tethered Connector) ', 43, 1, 400, 63, 'Level 3:  High (Over 40kW)', 'AC (Three-Phase)'),
(388, 311274, 'CCS (Type 2)', 100, 2, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(389, 311274, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(390, 311272, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(391, 311272, 'CHAdeMO', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(392, 302531, 'CCS (Type 2)', 150, 4, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(393, 302530, 'CCS (Type 2)', 150, 4, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(394, 302529, 'CCS (Type 2)', 150, 4, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(395, 302528, 'CCS (Type 2)', 150, 4, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(396, 302527, 'CCS (Type 2)', 150, 4, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(397, 302526, 'CCS (Type 2)', 150, 4, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(398, 300176, 'Type 2 (Tethered Connector) ', 22, 4, 400, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(399, 290232, 'Type 2 (Tethered Connector) ', 22, 1, 400, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(400, 274172, 'Type 2 (Tethered Connector) ', 22, 1, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(401, 274076, 'Type 2 (Tethered Connector) ', 22, 1, 230, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(402, 273999, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(403, 266658, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(404, 266634, 'CCS (Type 2)', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(405, 266634, 'CHAdeMO', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(406, 266634, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(407, 266542, 'CCS (Type 2)', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(408, 266542, 'CHAdeMO', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(409, 266542, 'Type 2 (Tethered Connector) ', 22, 2, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(410, 266542, 'CCS (Type 2)', 100, 2, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(411, 266533, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(412, 266533, 'CHAdeMO', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(413, 266533, 'CCS (Type 2)', 50, 1, 1000, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(414, 266532, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(415, 266532, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(416, 266532, 'CCS (Type 2)', 50, 1, 1000, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(417, 266532, 'CHAdeMO', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(418, 266531, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(419, 266531, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(420, 266531, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(421, 266531, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(422, 266516, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(423, 266516, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(424, 266515, 'Type 2 (Tethered Connector) ', 22, 3, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(425, 266515, 'CCS (Type 2)', 50, 2, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(426, 266459, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(427, 266428, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(428, 266428, 'CCS (Type 2)', 50, 2, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(429, 265402, 'CCS (Type 2)', 180, 2, 1000, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(430, 260102, 'Type 2 (Tethered Connector) ', 22, 2, 230, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(431, 259608, 'Type 2 (Tethered Connector) ', 22, 2, 230, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(432, 258410, 'Type 2 (Socket Only)', 22, 4, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(433, 258409, 'Type 2 (Tethered Connector) ', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(434, 238035, 'Type 2 (Tethered Connector) ', 22, 2, 230, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(435, 235594, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(436, 235593, 'Type 2 (Tethered Connector) ', 22, 2, 230, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(437, 211233, 'CCS (Type 2)', 50, 1, 1000, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(438, 211233, 'CHAdeMO', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(439, 211233, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(440, 211233, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(441, 211233, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(442, 211232, 'CCS (Type 2)', 50, 1, 1000, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(443, 211232, 'CHAdeMO', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(444, 211231, 'Type 2 (Socket Only)', 22, 2, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(445, 211230, 'Type 2 (Socket Only)', 22, 1, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(446, 211230, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(447, 211229, 'CCS (Type 2)', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(448, 211229, 'CHAdeMO', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(449, 211229, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(450, 211228, 'Type 2 (Socket Only)', 22, 2, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(451, 211227, 'CCS (Type 2)', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(452, 211227, 'CHAdeMO', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(453, 211227, 'Type 2 (Tethered Connector) ', 22, 1, 500, 125, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(454, 211226, 'CCS (Type 2)', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(455, 211226, 'CHAdeMO', 50, 1, 500, 125, 'Level 3:  High (Over 40kW)', 'DC'),
(456, 211226, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(457, 208638, 'Type 2 (Socket Only)', 11, 1, 400, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(458, 207017, 'Type 2 (Tethered Connector) ', 22, 1, 230, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(459, 207017, 'CCS (Type 2)', 30, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(460, 207016, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(461, 204326, 'Type 2 (Tethered Connector) ', 22, 2, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(462, 204325, 'Type 2 (Tethered Connector) ', 22, 2, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(463, 204324, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(464, 204323, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(465, 204323, 'Type 2 (Tethered Connector) ', 22, 1, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(466, 204322, 'Type 2 (Tethered Connector) ', 22, 2, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(467, 194317, 'Type 2 (Tethered Connector) ', 22, 2, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(468, 193723, 'Type 2 (Tethered Connector) ', 22, 1, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(469, 193606, 'Type 2 (Tethered Connector) ', 22, 1, 230, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(470, 193605, 'Type 2 (Tethered Connector) ', 22, 2, 230, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(471, 192300, 'Type 2 (Tethered Connector) ', 22, 2, 380, 32, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)'),
(472, 191005, 'CCS (Type 2)', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(473, 191005, 'CHAdeMO', 50, 1, NULL, NULL, 'Level 3:  High (Over 40kW)', 'DC'),
(474, 191005, 'Type 2 (Tethered Connector) ', 22, 1, NULL, NULL, 'Level 2 : Medium (Over 2kW)', 'AC (Three-Phase)');

-- --------------------------------------------------------

--
-- Structure de la table `stations`
--

CREATE TABLE `stations` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `postcode` varchar(50) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `operator` varchar(255) DEFAULT NULL,
  `operator_website` text DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `is_operational` tinyint(1) DEFAULT NULL,
  `usage_cost` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `stations`
--

INSERT INTO `stations` (`id`, `uuid`, `title`, `address`, `city`, `province`, `postcode`, `latitude`, `longitude`, `operator`, `operator_website`, `status`, `is_operational`, `usage_cost`) VALUES
(191005, 'C0230E6B-8CEE-4960-A51A-0368309B4BA9', 'Afriquia Agadir', 'Near Hotel Ibis Budget Agadir', 'Agadir', 'Souss-Massa ⵙⵓⵙⵙ-ⵎⴰⵙⵙⴰ سوس-ماسة', '80026', 30.40637750615646, -9.534297270726825, '(Unknown Operator)', NULL, 'Operational', 1, 'Non disponible'),
(192300, '834F08F5-E3F7-413F-9899-4D5C38E11E04', 'Sela Gallery (Ex Label Gallery)', 'Avenue Mohammed VI شارع محمد السادس', 'Rabat', 'Rabat-Salé-Kenitra', '10105', 33.97397554773538, -6.8295453765072125, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Free'),
(193605, '2AC716A0-4F8D-401F-AEC3-46903CD41953', 'Avenue Allal Ben Abdallah', 'Avenue Allal Ben Abdallah', 'Fez', 'Fez-Meknes', '30013', 34.03594510674549, -5.0040273474089645, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Non disponible'),
(193606, '88451DC6-F487-47E4-AF02-3E56C56E4DFC', 'Commune de Fès جماعة فاس', 'Commune de Fès جماعة فاس', 'Fez', 'Fez-Meknes', '30000', 34.0344907565552, -5.015782632007586, '(Unknown Operator)', NULL, 'Operational', 1, 'Non disponible'),
(193723, '94263A1B-EB61-4E34-97A5-E5E3E7ED9782', 'TotalEnergies Relais Mazagan', 'Autoroute de l’Atlantique', 'Ouled Ghanem ولاد', 'Casablanca-Settat', '', 33.03165967959413, -8.534901203175878, '(Unknown Operator)', NULL, 'Operational', 1, 'Non disponible'),
(194317, '89831517-C19F-40F8-8111-7A0FD6B5BEAF', 'Mall Ibn Batouta', 'Avenue Youssef Bnou Tachafine', 'Tanger', NULL, NULL, 35.77760684421172, -5.801783986233318, '(Unknown Operator)', NULL, 'Operational', 1, 'Free'),
(204322, '465186A1-DDF0-4777-8CC7-B45BB6942616', 'Winxo - Motel budget Safari - Café Restaurant', 'RN 10', 'Ouarzazate', 'Ouarzazate', '45000', 30.939102949406077, -6.977384713331958, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Free'),
(204323, 'B9F3D2A7-DB03-4E4A-ADFD-D4E9B6E9229E', 'Hotel Chams ', 'Av Abdelkhalek Torres', 'Tetouan', NULL, '', 35.5809545579352, -5.33629625254207, '(Unknown Operator)', NULL, 'Operational', 1, '0'),
(204324, '430F47D9-D6CF-4DB8-9976-DB7F650D285E', 'TotalEnergies Riviera', 'Rue Omar Al Khayam, Rte d\'El Jadida ', 'Casablanca', 'Casablanca', '20250', 33.56827270783131, -7.644602467375307, '(Unknown Operator)', NULL, 'Operational', 1, 'Non disponible'),
(204325, 'F9047921-A9BC-46D2-85EE-D41DB01909E7', 'Hotel Senator', 'Tanger Free Zone', 'Tanger', 'Tanger', NULL, 35.715185011390744, -5.904376028563092, '(Unknown Operator)', NULL, 'Operational', 1, 'Free'),
(204326, '0E4B79AD-024F-48B4-998D-5771F73ED5B2', 'Socco Alto', 'Route California', 'Tanger', 'Tanger', '90005', 35.781527905977924, -5.8408312515125544, '(Unknown Operator)', NULL, 'Operational', 1, 'Free'),
(207016, '531D4863-DEAC-4C82-9FB7-34924C9997E8', 'Apia Restaurant', 'RN13', 'Ouazzane', 'Tangier-Tetouan-Al Hoceima', NULL, 34.83466374795742, -5.543029131000708, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Free'),
(207017, '652EDE1B-965F-4D8D-93B8-BAA13883CA69', 'Winxo Oujda', 'RN17', 'Oujda', NULL, NULL, 34.739487500646106, -1.9290893314769164, '(Unknown Operator)', NULL, 'Operational', 1, 'Free'),
(208638, 'D91901AB-7891-484B-B470-CAC3ED6A2060', 'Aeropuerto de Melilla', 'Parking general P1', 'Melilla', 'Melilla', NULL, 35.2772830258251, -2.958150686614431, '(Business Owner at Location)', NULL, 'Operational', 1, '0,32€/kWh + parking fee'),
(211226, 'D9DEFDB4-2B1E-4855-B585-9614720F72F7', 'Afriquia Meknes Riad El Menzeh', 'RN13', 'Meknès ', NULL, '50070', 33.840254576480035, -5.521765658444565, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(211227, 'F8D9A70F-45CA-42EC-9A69-1046B6AE7FAD', 'Afriquia Zenata Ikea', 'Ikea Zenata', 'Ain Harrouda عين حرودة', 'Casablanca', NULL, 33.62788451457321, -7.461671331288358, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(211228, '92A0DDAB-ECDE-4DEF-B762-EF4536DCDED5', 'Afriquia Boulevard des F.A.R شارع الجيش الملكي', 'Boulevard des F.A.R شارع الجيش الملكي', 'Meknès', NULL, '50010', 33.89781438006548, -5.534755506098918, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(211229, 'AE0EFCBC-1C80-4FEE-B36B-82069AF11711', 'Afriquia Miami Fès', 'Pénétrante de Fès', 'Fès', NULL, '30042', 33.98237252285293, -5.028836746132583, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(211230, '583AECF3-2BDB-45EC-B601-503765E2C43A', 'Afriquia Essaouira', 'RN8', 'Essaouira ', NULL, '44000', 31.49605940028789, -9.755090383015954, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(211231, '489E8489-4B8A-4C0F-BCE7-725FFC2E26CC', 'Afriquia Centre 65 Marrakech ', 'Avenue Essaouira طريق الصويرة', 'Marrakech ', NULL, '40056', 31.62822398005359, -8.037395224873308, '(Unknown Operator)', NULL, 'Operational', 1, 'Non disponible'),
(211232, '74094BCB-3562-44E7-979A-6355C58528BC', 'Afriquia Tafraouti Ain Sebaa', 'Rue Ghiriane', 'Casablanca Ain Sebaa', 'Casablanca', '20590', 33.60437587477604, -7.547670898936076, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(211233, 'A30B7E29-329B-46B8-8F4F-8B6F87F4ED9C', 'Morocco Mall', 'Boulevard de Biarritz', 'Casablanca Ain Diab', 'Casablanca', '20202', 33.57686256903399, -7.705703551104307, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(235593, '8B9559A3-B16F-4302-A323-6CC4B143E3AF', 'Berkane Ville', 'Province De Berkane', 'Berkane', 'berkane', NULL, 34.92820103935651, -2.3279448208283497, '(Unknown Operator)', NULL, 'Operational', 1, 'Free'),
(235594, '0E192D19-A200-458F-A048-AEBE8B3664F5', 'Kilowatt.ma - Kasbah Sirocco', 'RN17', 'Zagora', NULL, NULL, 30.319702856684103, -5.82760437983552, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Free'),
(238035, '6FFA942B-2953-44BC-A4E5-FC76F593975B', 'Al Mazar Mall', 'Route De Ourika', 'Marrakech', 'Marrakech', NULL, 31.592960428346714, -7.985902571885049, '(Unknown Operator)', NULL, 'Operational', 1, 'Free'),
(258409, '2FF752B3-F6A5-4D61-B14F-E083D4F71BD7', 'Afriquia Taddart', 'Route de Taddart', NULL, NULL, '20460', 33.51940636681522, -7.6161803667910135, '(Unknown Operator)', NULL, 'Operational', 1, 'Non disponible'),
(258410, '04F34CB0-DD7C-4FC1-86CD-376CEAE2C42E', 'McDonald\'s de la Corniche', 'Boulevard de la Corniche', 'Casablanca', NULL, '20054', 33.6016565265202, -7.661221906286983, '(Unknown Operator)', NULL, 'Operational', 1, 'Non disponible'),
(259608, '170B58D2-BFB7-4339-A298-A38E3E2F298E', 'Label Galerie Safi ', 'Av Zerktouni', 'Safi', 'safi', '46013', 32.292743189620325, -9.234626064688428, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Free'),
(260102, 'F26FBBE8-961E-4209-BC10-E24ED632A3F4', 'TotalEnergies Amskroud', 'Autoroute Casablanca-Agadir طرق السيارات الدار البيضاء - أكادير', 'Amskroud ⴰⵎⵙⴽⵔⵓⴹ أمسكروض', NULL, NULL, 30.45481566777262, -9.360077166174278, '(Unknown Operator)', NULL, 'Operational', 1, 'Free'),
(265402, '09E494AB-AA1E-4A3A-95D8-5A3E122978CE', 'Les Terasses Gourmandes - Kilowatt.ma', 'Bouskoura', 'Bouskoura', 'Casablanca', '20000', 33.487143168829235, -7.633673878508148, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, '80 dhs per session / additional 3dh per minute after charge completion'),
(266428, '089A7FD3-82A0-43A5-B129-9F1A23C1AB92', 'Station Afriquia Sidi Bou OTHMAN', 'Station Afriquia Sidi Bou OTHMAN', 'Marrakech', NULL, NULL, 31.91813912674118, -8.023951461590741, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(266459, '21C0CFAE-05CB-40CA-9D3D-EE8047E6A74C', 'Kilowatt.ma Complexe Les Palmiers', 'Errachidia', 'Errachidia', NULL, NULL, 31.943479683052047, -4.462780323783107, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'free'),
(266515, 'FF47DFB0-9F7A-4433-B5B5-7F975EABC6D5', 'Station Afriquia Nouasseur', 'Station Afriquia Nouasseur', 'CASABLANCA', NULL, '10000', 33.3797, -7.566667, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(266516, '083899BD-5618-4AAB-B2EF-D204194DC206', 'Station Afriquia Taddart', 'Station Afriquia Taddart', 'CASABLANCA', NULL, '10000', 33.5194303, -7.6161737, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(266531, 'D3E8A602-1830-42AF-A53C-35E1F2D9FCBC', 'Afriquia Marjane Hay Riad', 'Afriquia Marjane Hay Riad', 'RABAT', NULL, '10000', 33.953727, -6.851473, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(266532, '92CFFAE5-8809-48B8-A0A9-1DB1C0B38038', 'Fairmont Taghazout', 'Fairmont Taghazout', 'AGADIR', NULL, '10000', 30.52268, -9.690229, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(266533, '28B089B3-7C9F-4641-A534-247B11703964', 'Michlifen Ifrane', 'Michlifen Ifrane', 'IFRANE', NULL, '10000', 33.535027, -5.107841, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(266542, 'BDE10655-88CD-48D4-B06A-03A22A56131A', 'Afriquia Rabat Al Melia', 'Boulevard Al Melia Hay Riad', 'RABAT', NULL, '10100', 33.968891240863144, -6.864245339339504, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(266634, 'D567679F-C5AE-435F-9905-788755C408DA', 'Afriquia Tetouan shore', 'N2, Morocco', 'Tetouan', NULL, '10000', 35.563973, -5.486762, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(266658, '9B5CBAED-22A3-4C03-BBD5-2ADF1EE474E5', 'Kilowatt.ma Station SP Azemmour', 'R320', 'Azemmour', NULL, NULL, 33.35908778822191, -8.2807259974455, '(Unknown Operator)', NULL, 'Operational', 1, 'Non disponible'),
(273999, 'C864426B-EAFB-4391-8B21-EF2524C686CD', 'Kilowatt.ma Hotel Barbas', 'Birguendouz', 'Birguendouz', '', NULL, 22.054645624290856, -16.74717707827881, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Free'),
(274076, '1A56A4E7-13EA-4E92-9CB3-1FA0826A41BA', 'Kilowatt.ma Hotel Boarding Dakhla', '1, rue bellevue', 'Dakhla', NULL, NULL, 23.705284243093402, -15.94322880548657, '(Unknown Operator)', NULL, 'Operational', 1, 'Free'),
(274172, '0B1B958E-299F-452A-B142-C518F17F117A', 'Kilowatt.ma Hotel Noon', 'Av. Mekka', 'Laayoune', 'laayoune', NULL, 27.148599887566675, -13.196035917546965, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Non disponible'),
(290232, '27FCE391-E9B9-467E-8B1E-F072CF55F316', 'Bornes de recharge - Al Akhawayn University - EVC.WATTSC.COM', 'GVQV+FJ Ifran, Morocco', 'Ifran', 'Ifran', '53000', 33.53602822209932, -5.104187565798725, '(Unknown Operator)', NULL, 'Operational', 1, '0'),
(300176, '6691952E-84B1-4460-908F-5E871C0555D0', '[Kilowatt.ma] Carrefour Salé', 'Angle Route Nationale de Kénitra et, Av. Assalam', 'Salé', 'Salé', '11060', 34.057936043717646, -6.801969287262978, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Free'),
(302526, 'D03518FB-76FA-487C-AA98-45877446031A', 'Tesla Supercharger Tangier Tanger', 'RN1', 'Tanger', NULL, '90010', 35.6667493, -5.9658079, 'Tesla (Tesla-only charging)', 'http://www.teslamotors.com', 'Operational', 1, '0.00'),
(302527, '4DF313E7-F598-4B3C-AAD0-EAC015E87D4E', 'Tesla Supercharger Rabat', 'Inside Sofitel Palais Des Roses', 'Rabat', NULL, '10190', 33.99121710000357, -6.836833900001466, 'Tesla (Tesla-only charging)', 'http://www.teslamotors.com', 'Operational', 1, '0.00'),
(302528, '29455777-2B1A-46E4-A0F5-D38920C94290', 'Tesla Supercharger Fes', 'RN4 Route de Sefrou', 'Fes', NULL, '30070', 33.9969709, -4.9700243, 'Tesla (Tesla-only charging)', 'http://www.teslamotors.com', 'Operational', 1, '0.00'),
(302529, 'EC9370FC-CCD1-467E-B835-B55258C8C375', 'Tesla Supercharger Casablanca', 'Boulevard Massira', 'Casablanca', NULL, '20000', 33.5863418, -7.6389559, 'Tesla (Tesla-only charging)', 'http://www.teslamotors.com', 'Operational', 1, '0.00'),
(302530, 'C69B85F2-3966-456C-B4E6-E60D436E9C85', 'Tesla Supercharger Marrakech', 'Sofitel Marrakech Rue Haroun Errachid', 'Marrakech', NULL, '40034', 31.622062400000146, -8.001945000000205, 'Tesla (Tesla-only charging)', 'http://www.teslamotors.com', 'Operational', 1, '0.00'),
(302531, '4C877752-36E0-42F2-A876-619747D27416', 'Tesla Supercharger Agadir', 'Corniche Tawada ⴽⵓⵔⵏⵉⵛ ⵜⴰⵡⴰⴷⴰ كورنيش تاوادا', 'Agadir', NULL, '80015', 30.39190540000162, -9.59712500000353, 'Tesla (Tesla-only charging)', 'http://www.teslamotors.com', 'Operational', 1, '0.00'),
(311272, '57A3A7C4-6011-493B-9811-D975BBB9C5D1', 'FastVolt Fairmont La Marina Rabat-Salé', 'La marina, Avenue de Fes, Rabat', 'Rabat - Salé', NULL, '11000', 34.03252864224564, -6.82823809895055, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311274, 'E4F42628-4855-41E0-B2DE-CA910F0181E9', 'FastVolt - Afriquia MC Village', 'KM 8, route de tanger Kenitra', 'Kénitra', NULL, '14010', 34.28923523452717, -6.506758748742641, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311283, '387A4192-90CA-4CB0-9579-1E3849631DCF', 'FastVolt Afriquia Fnideq', 'N13 Rn 9 Pk 230+532', 'Fnideq ', NULL, '90070', 35.83336034830373, -5.355123530049241, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311298, '99048754-4BEA-4A8E-BCF5-79B47B9BFBD7', 'FastVolt Afriquia Kenitra AFZ', 'N4, Zone Franche', 'Kenitra', NULL, '14000', 34.30466543360957, -6.366853043625838, '(Unknown Operator)', NULL, 'Operational', 1, 'Non disponible'),
(311306, '5B9229F4-2D61-40BE-98F4-E7AB761F5E73', 'FastVolt Afriquia Fnideq', 'RJMV+9WF, N13', 'Fnideq', NULL, NULL, 35.83338713296395, -5.355127456784203, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311307, '425AD8AB-964A-4A48-BFE5-70B1713057D9', 'FastVolt  Afriquia Narjiss ADM', 'Aire de repos Autoroute Kénitra vers Rabat PK 27+500', 'Kénitra', NULL, NULL, 34.230542023479956, -6.5853110305563405, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311309, '3C7A2501-E6E6-4F5A-82B7-5E0B4800ACEA', 'FastVolt Afriquia Mnar', 'R734+2GV', 'Tanger', NULL, NULL, 35.802414123521515, -5.7435593006919134, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311310, '3775948C-BDFE-46C8-9102-56CF4CF930DA', 'FASVOLT - Afriquia Tanger Zone Franche', 'Zone Franche Tanger', 'Tanger', NULL, '90100', 35.716104924586205, -5.904593329906675, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311362, '5BC8DE20-978B-4D7C-B346-7408846160AC', 'FastVolt Afriquia Technopole Oujda', 'RN n°2 PK564+400 Commune rural Ahl Angad', 'Oujda', NULL, NULL, 34.77200809725856, -1.9419257202828248, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311363, '45BC5519-F381-4D9A-ABAD-E07DE30FBB8C', 'FastVolt Afriquia Oujda National Gaz', 'P33+VCG2 ', 'Oujda', NULL, NULL, 34.72739728417561, -1.9239218809887007, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311364, 'AC5391C5-F949-4230-954E-BFB962326845', 'FastVolt Afriquia Marinasmir', 'Centre ville ', 'Mdiq', NULL, NULL, 35.736168177464876, -5.342509866759201, 'FastNed', 'https://fastnedcharging.com/', 'Operational', 1, 'Non disponible'),
(311365, '308B8A33-FFB8-4E53-8D34-9855EE9061AC', 'FastVolt Afriquia ADM Laayoune', 'Aire de service de Laayoune PK 281', 'El  Aioun', NULL, '34000', 34.61491229369473, -2.43947444329433, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311366, '337EE3F1-D7BD-4867-B9BB-50D9D8BB4229', 'FastVolt Afriquia ADM Msoun', 'PK 149, Aire de service', 'Msoun', NULL, '34000', 34.31004544000969, -3.7476293236334186, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311367, '2AD9FF08-F712-4FF5-B8B2-E81B822F375C', 'FastVolt Afriquia PLM Beni Mellal', 'route de khouribga, boulevard mohamed 5', 'Beni Mellal', NULL, '23000', 32.32340179548831, -6.3807631664261635, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311368, '6EB9248A-E5E3-4922-9D7C-CD0E11A36EB0', 'FastVolt Afriquia Bab Al Kelaa Marrakech', 'J2WF=66Q, route de Fès', 'Marrakesh', NULL, '40000', 31.645658458346176, -7.9768452806727055, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311370, 'B6007285-3EAB-424C-BC46-AA04AFE269EB', 'FastVolt Kia Maroc Succursale Marrakech', 'M2X8+P4M, P2008, OUAHAT SIDI BRAHIM', 'Marrakech', NULL, '40000', 31.699396406020725, -7.984480677020883, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311371, 'DEFCBD8D-0EA4-4A1A-9F4B-799A0ECE7838', 'FastVolt Afriquia ADM Lmintanout', 'Autoroute agadir vers marrakech', 'Lmintanout', NULL, '34000', 31.025270565397037, -9.023107837351745, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311372, 'A95D2DDE-71B0-4618-B8F8-55120B6D9DA0', 'Winxo Imintanoute', 'Autoroute marrakech vers agadir ', 'Imintanoute', NULL, '34000', 31.025543677385244, -9.024822192977808, NULL, NULL, 'Operational', 1, 'Non disponible'),
(311374, '23A47F60-48E0-4080-87A0-A6757A177041', 'FastVolt Socozed Safi', 'Station service Afriquia Socozed', 'Safi', NULL, '40000', 32.29652998714381, -9.190622987789084, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311375, '7BD42DBD-0206-455A-B5A2-0FB6E973C036', 'FastVolt Afriquia Al Boustane', 'ADM Mohammadia ', 'Marrakech', NULL, 'Bouznika', 33.77736662504526, -7.2333686380421796, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311376, 'FB3767AB-F293-4718-A91E-23A44B0041C3', 'FastVolt Afriquia Hamza Fes', 'avenue Moulay Abdellah, Fes, Morocco', 'Fes', NULL, '34000', 33.99648209704715, -4.99169034087663, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311380, 'E4D08A54-17EE-4893-8674-7CD370AB0F05', 'kilowatt.ma- Selouane Winxo Groupe Aliman', '33M7+VRF, Selouane, Maroc', 'Nador', NULL, NULL, 35.0844617579922, -2.9354218565820247, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Non disponible'),
(311412, '74AC3613-59F7-4D0D-9D4D-5E38FFB99B73', 'FastVolt Place Des Nations Unies Tanger, Somagec', 'Q5HW+6GH, Tanger, Morocco', 'Tanger', NULL, '34000', 35.77756897275276, -5.8034842413730985, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311467, 'CD76C532-B0F2-4E8C-81D1-5F7189FD3A64', 'Afriquia Panoramique FastVolt Parking sous-sol', 'H92M+3QW Bd Panoramique', 'Casablanca', NULL, '34000', 33.550173190602976, -7.615703514213465, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311468, '126BC60D-C68F-4DDD-9100-5CC0863CD631', 'FastVolt Afriquia Lissasfa Exit', 'Sortie Lissasfa A102 direction El Jadida', 'Casablanca', NULL, NULL, 33.50545607277587, -7.678140141810445, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311510, 'E9976FA1-9FC7-475C-9AAB-D8D5820E19AA', 'FastVolt Marjane Tanger ', 'P5W3+5C9, Tangier, Morocco', 'Tanger', NULL, '34000', 35.74572447617655, -5.846452652323819, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311511, 'FB313609-585E-460C-B822-B4B7AC5BD2C6', 'FastVolt Afriquia Golf Tanger', 'Lotissement Al Bahraine, Moujahidine', 'Tanger', NULL, NULL, 35.767986334734005, -5.859296398585798, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311512, 'B59AA672-994C-42CE-B8B0-14C53293A468', 'FastVolt Parking Marina Shopping', 'Sidi Mohammed Ben Abdellah Boulevard, Ancienne Medina, Arrondissement de Sidi Belyout', 'Casablanca', NULL, '34000', 33.607378814617334, -7.62165220537895, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311513, 'E5E24AE0-74B8-40FD-9B25-B46EE2575CDD', 'FastVolt Afriquia Oasis', 'Route Al Jamiaa, Ferme Bretonne, Préfecture d\'arrondissement de Hay Hassan', 'Casablanca', NULL, '34000', 33.55884471492895, -7.644935604142347, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311514, '4AF51326-984A-4C80-A90C-206111F3674D', 'FastVolt Marjane California', 'Marjane, Boulevard Panoramique, Californie, Arrondissement d\'Aïn-Chock', 'Casablanca', NULL, '34000', 33.54472684630785, -7.640402673101562, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311515, '1F70320E-EE4A-412A-92D2-AAC959EE2144', 'FastVolt Afriquia Lbir Jdid', 'Aire de Service Bir Jdid, Autoroute Safi vers Rabat', 'Bir Jdid', NULL, '34000', 33.35256543456005, -7.979708703865072, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(311516, '3845A35E-1730-4D77-A607-46B6F14EC9E3', 'Kilowatt.ma - Town Hall Saidia', 'Camping de Mansour, Avenue Hassan II, Saïdia', 'Saidia', NULL, '34000', 35.087879127869556, -2.238822078158705, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Non disponible'),
(311517, '1EC1CD67-30FE-4219-B668-C4CE0F304484', 'Kilowatt.ma - Marina Saidia Resorts', 'RN16;RP6000, Laâtamna, Caïdat de Laâtamna', 'Saidia', NULL, NULL, 35.11105194300305, -2.2955384326953663, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Non disponible'),
(311616, '3B754D0F-DF25-43CC-B775-5D80BEB68A2C', 'Central Commercial Borj Fes', 'Borj Fez, Boulevard Allal El Fassi, Agdal, Arrondissement d\'Agdal, Fès', 'Fes', NULL, NULL, 34.04584386341807, -4.994938494645908, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Non disponible'),
(311617, 'E4A2E44D-D3D2-496C-BE8B-8B8ECF0A2F6A', 'Commune de Fès', 'Hay Doukkarate, Arrondissement d\'Agdal, Fès', 'Fes', NULL, NULL, 34.034567702758835, -5.015748371080804, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Non disponible'),
(311618, '59BD423A-248B-4CA2-BC16-B465236ED4D2', 'Kilowatt.ma - Carrefour market Label\' Galery Meknes', 'Carrefour, Avenue Allal Ben Abdellah, Meknès', 'Meknes', NULL, '34000', 33.89213381391872, -5.54085981386288, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Non disponible'),
(311620, 'D8AF6721-FDC3-48F7-BEDF-3EFE544003DC', 'TotalEnergies Relais Mazagan', 'Aire de Service Jorf Lasfar, Autoroute Rabat - Safi, Oulad Hcine', 'El Jadida', NULL, '34000', 33.03068236174934, -8.534787606262967, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Non disponible'),
(311621, '08A6639D-FAB3-446C-9E43-86E30AB7BA56', 'Ecolodge la Palmeraie', 'Palm Grove restaurant, Tajda, Ouarzazate', 'Ouarzazate', NULL, '34000', 30.904194606431858, -6.898011287222289, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Non disponible'),
(311791, '406A5274-4569-46C0-8E95-3E05469D7CC0', 'Total Energies Sfiha Ajdir El Hoceïma', 'N16', 'Al Hoceima', NULL, NULL, 35.19655120247573, -3.8938258384971505, NULL, NULL, 'Operational', 1, 'Non disponible'),
(312704, 'FFE3B83D-B60A-4DC3-9E61-E810970F24E7', 'TotalEnergies Chichaoua vers Nord', 'Aire De Repos Chichaoua', 'Chichaoua', NULL, NULL, 31.486760098309006, -8.655130419044212, '(Unknown Operator)', NULL, 'Operational', 1, 'Non disponible'),
(313652, '1BE24664-B47F-4380-90C3-58BEAB852239', 'FastVolt Afriquia FastVolt Ksar Sghir Tanger Med', 'autoroute Tanger MED', 'Ksar Sghir ', 'Ksar Sghir ', NULL, 35.836367578194, -5.556692289207149, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(313956, 'B0637EC5-C7B8-4F44-B51F-7F30862674EB', 'Kilowatt.ma - Ikea Tétouane', 'Maha Beach Resort, M\'Diq', 'Tetouane', 'Tetouane', NULL, 35.651709994512075, -5.309646661540455, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Non disponible'),
(313957, '298557C8-0602-418A-8B53-EE7EC04F2E53', 'Tanger Med Port Authority', 'RN16, Ksar El Majaz, caïdat de Ksar El Majaz, Cercle d\'Anjra', 'Ksar El Majaz', NULL, NULL, 35.8700340117215, -5.520144902866718, '(Unknown Operator)', NULL, 'Operational', 1, 'Non disponible'),
(314010, 'C9D15837-A9A3-4D67-9F39-AEDBC8219BC0', 'FastVolt Afriquia Mnasra 2 vers Sud 100 kW', 'Aire de Service M\'Nasra, Autoroute Port Tanger Med', 'Bahhara Oulad Ayad بحارة أولاد عياد', 'Rabat-Salé-Kenitra', NULL, 34.64487436444523, -6.407604749167604, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(460244, 'E43A5435-0AC0-496C-80E6-ED34D9E7E064', 'The View AGADIR 100KW', 'Boulevard Du 20 AOÛT ', 'Agadir', NULL, NULL, 30.41610185337558, -9.60317588123894, '(Unknown Operator)', NULL, 'Operational', 1, 'Free'),
(460398, 'DA608950-7AAB-4FDF-98CC-B3662536234A', 'kilowatt - Aswak Assalam', 'Avenue mehdi benbarka', 'Rabat', 'Rabat', '10000', 33.9478580979864, -6.870084225444202, 'Kilowatt.ma', 'https://kilowatt.ma', 'Operational', 1, 'Non disponible'),
(471453, 'D7D33FB6-8F80-4A3E-857F-535F8AEB831B', 'FastVolt Afriquia Al Hoceima', 'N16', 'Al Hoceima', NULL, NULL, 35.15791783480513, -3.978218263158169, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(471455, 'FFD1A9AE-2387-453F-89C0-AB2B4D708858', 'FastVolt Afriquia Berkane', 'N16', 'Berkane', NULL, NULL, 35.035202670861366, -2.3440503504353956, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible'),
(471457, '7282D9AA-7DD1-49DD-95D4-5D8A3DC3D627', 'FastVolt Afriquia Ouad Amlil', 'N16', 'Ouad Amlil', NULL, NULL, 34.19679966412164, -4.277819263049878, 'Fastvolt', 'https://fastvolt.net/', 'Operational', 1, 'Non disponible');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `connections`
--
ALTER TABLE `connections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_station` (`station_id`);

--
-- Index pour la table `stations`
--
ALTER TABLE `stations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `connections`
--
ALTER TABLE `connections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=475;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `connections`
--
ALTER TABLE `connections`
  ADD CONSTRAINT `fk_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
