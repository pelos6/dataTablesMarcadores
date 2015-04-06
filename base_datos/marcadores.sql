-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 18-01-2013 a las 12:39:35
-- Versión del servidor: 5.5.28
-- Versión de PHP: 5.3.10-1ubuntu3.4

CREATE DATABASE marcadoresImportados;

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


USE  marcadoresImportados;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `marcadoresImportados`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marcadoresImportados`
--

CREATE TABLE IF NOT EXISTS `marcadoresImportados` (
  `idMarcador` int(10) NOT NULL AUTO_INCREMENT,
   `urlMarcador` varchar(400) NOT NULL,
  `conceptoMarcador` varchar(400) NOT NULL,
  PRIMARY KEY (`idMarcador`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `marcadoresImportados`
--

INSERT INTO `marcadoresImportados` (`urlMarcador`,`conceptoMarcador`) VALUES
('http://zaragozaciudad.net/azlinux/', 'Zaragoza Linux');



create view vmarcadoresimportados as 
SELECT idMarcador, concat('<a href="',urlMarcador,'" target="_blank" >',urlMarcador,'</a>') hrefMarcador , urlMarcador , conceptoMarcador from marcadoresImportados ;

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `usuario` char(20) NOT NULL,
  `password` char(50) NOT NULL,
  PRIMARY KEY (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
