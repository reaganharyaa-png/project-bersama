DROP DATABASE IF EXISTS pinjamlab;
CREATE DATABASE pinjamlab;
USE pinjamlab;

CREATE TABLE equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(60) NOT NULL,
  status ENUM('available','borrowed') NOT NULL DEFAULT 'available'
);

CREATE TABLE loans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_id INT NOT NULL,
  borrower_name VARCHAR(80) NOT NULL,
  borrowed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  returned_at DATETIME NULL,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);

INSERT INTO equipment (name, category) VALUES
('Webcam HD', 'Multimedia'),
('Mikrofon USB', 'Audio'),
('Kabel HDMI', 'Aksesori'),
('Proyektor Mini', 'Presentasi'),
('Tripod Kamera', 'Multimedia'),
('Mouse Wireless', 'Aksesori');