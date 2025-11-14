<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Undertale Cards</title>
  <style>
    body {
      background: black;
      font-family: 'Courier New', monospace;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .card-container {
      display: flex;
      gap: 20px;
    }

    .card {
      background: #111;
      border: 4px solid white;
      padding: 20px;
      width: 200px;
      text-align: center;
      box-shadow: 0 0 10px white;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .card:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px #ff0000;
      border-color: #ff0000;
    }

    .card img {
      width: 100px;
      height: 100px;
      image-rendering: pixelated; /* retro pixel look */
    }

    .card-title {
      font-size: 18px;
      margin-top: 10px;
      text-transform: uppercase;
    }

    .card-desc {
      font-size: 14px;
      margin-top: 5px;
      color: #ccc;
    }
  </style>
</head>
<body>
  <div class="card-container">
    <div class="card">
      <img src="https://placekitten.com/100/100" alt="Character">
      <div class="card-title">Sans</div>
      <div class="card-desc">Lazy skeleton with bad puns.</div>
    </div>

    <div class="card">
      <img src="https://placebear.com/100/100" alt="Character">
      <div class="card-title">Papyrus</div>
      <div class="card-desc">Energetic skeleton who loves spaghetti.</div>
    </div>

    <div class="card">
      <img src="https://placebeard.it/100x100" alt="Character">
      <div class="card-title">Flowey</div>
      <div class="card-desc">A flower with a sinister smile.</div>
    </div>
  </div>
</body>
</html>
