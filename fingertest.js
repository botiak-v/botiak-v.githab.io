let webcam, labelContainer, detector;

init();

async function init() {
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
    modelType: 'lite'
  };
  detector = await handPoseDetection.createDetector(model, detectorConfig);

  const flip = true;
  webcam = new tmImage.Webcam(600, 500, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

const skipCount = 5;
let frameCount = 0;

async function predict() {
  if (frameCount % skipCount == 0) {
    const hands = await detector.estimateHands(webcam.canvas);

    if (hands.length == 0)
      labelContainer.innerHTML = "Ви не показуєте руки!";
    else {
      if (hands[0].handedness == "Left")
        labelContainer.innerHTML = "Ви показуєте ліву руку!<br><br>";
      else
        labelContainer.innerHTML = "Ви показуєте праву руку!<br><br>";
      const keypoints = hands[0].keypoints;
      for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];
        labelContainer.innerHTML += keypoint.name +
          ": (" + Math.round(keypoint.x) +
          ", " + Math.round(keypoint.y) + ")<br>";
      }
      const fingerAngles = calculateFingerAngles(keypoints);
      labelContainer.innerHTML += "<br>Кути між пальцями:<br>";
      for (const angle of fingerAngles) {
        labelContainer.innerHTML += angle.name + ": " + angle.angle + " градусів<br>";
      }
    }
  }

  frameCount++;
}

function calculateFingerAngles(keypoints) {
  const fingerAngles = [];
  const fingerIndices = [
    [0, 1, 2],  // Thumb: MCP, PIP, TIP
    [0, 5, 6],  // Index finger: MCP, PIP, TIP
    [0, 9, 10], // Middle finger: MCP, PIP, TIP
    [0, 13, 14], // Ring finger: MCP, PIP, TIP
    [0, 17, 18] // Little finger: MCP, PIP, TIP
  ];

  for (const indices of fingerIndices) {
    const [mcpIndex, pipIndex, tipIndex] = indices;
    const mcp = keypoints[mcpIndex];
    const pip = keypoints[pipIndex];
    const tip = keypoints[tipIndex];

    const mcpToPip = calculateDistance(mcp, pip);
    const pipToTip = calculateDistance(pip, tip);

    const mcpToPipVector = [pip.x - mcp.x, pip.y - mcp.y];
    const pipToTipVector = [tip.x - pip.x, tip.y - pip.y];

    const dotProduct = mcpToPipVector[0] * pipToTipVector[0] +
                       mcpToPipVector[1] * pipToTipVector[1];
    const magnitudeProduct = mcpToPip * pipToTip;

    const angle = Math.acos(dotProduct / magnitudeProduct) * (180 / Math.PI);

    fingerAngles.push({
      name: keypoints[mcpIndex].name + "-" + keypoints[tipIndex].name,
      angle: angle.toFixed(2)
    });
  }

  return fingerAngles;
}

function calculateDistance(pointA, pointB) {
  const deltaX = pointA.x - pointB.x;
  const deltaY = pointA.y - pointB.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
