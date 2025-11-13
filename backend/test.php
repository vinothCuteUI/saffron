<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  echo "POST received!";
} else {
  echo "Method not allowed";
}
?>