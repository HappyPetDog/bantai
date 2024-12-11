from flask import Flask, request, jsonify
import cv2
from ultralytics import YOLO
import os
import logging
import shutil
import uuid

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load YOLO model
model = YOLO("best.pt")  # Replace with your model weights


@app.route("/process-video", methods=["POST"])
def process_video():
    # Get the video file path from the request body
    data = request.get_json()
    video_path = "front-end/" + data.get("videoPath")

    # Log the video path
    app.logger.info(f"Processing video: {video_path}")

    if not video_path or not os.path.exists(video_path):
        return jsonify({"error": "Video not found"}), 400

    # Generate a random ID for the output directory
    random_id = str(uuid.uuid4())
    output_dir = f"front-end/public/results/{random_id}"
    os.makedirs(output_dir, exist_ok=True)

    # Process the video and save the output
    try:
        results = model.predict(
            source=video_path,
            save=True,
            save_txt=True,
            classes=[1, 2],  # Include class 2 for severe accidents
            conf=0.7,
            project=output_dir,
            device="mps",
        )
        # Determine the actual output directory used by YOLO
        output_subdir = results[0].save_dir
        output_video_path = os.path.join(output_subdir, os.path.basename(video_path))
        app.logger.info(f"Output video saved to: {output_video_path}")

        # Check the severity of the accident
        severity = "no accident"
        txt_files_found = False
        for root, dirs, files in os.walk(output_subdir):
            for file in files:
                if file.endswith(".txt"):
                    txt_files_found = True
                    with open(os.path.join(root, file), "r") as f:
                        for line in f:
                            parts = line.split()
                            if parts[0] == "2":
                                severity = "severe"
                            elif parts[0] == "1" and severity != "severe":
                                severity = "moderate"

        if not txt_files_found:
            severity = "no accident"

        # Delete the labels folder
        labels_folder = os.path.join(output_subdir, "labels")
        if os.path.exists(labels_folder):
            shutil.rmtree(labels_folder)

    except Exception as e:
        app.logger.error(f"Error processing video: {e}")
        return jsonify({"error": "Error processing video"}), 500

    return jsonify(
        {
            "message": "Video processed successfully",
            "output_video_path": output_video_path,
            "severity": severity,
            "id": random_id,
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
