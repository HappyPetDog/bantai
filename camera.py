import cv2
from detection import AccidentDetectionModel
import numpy as np

model = AccidentDetectionModel("model.json", "model_weights.h5.keras")
font = cv2.FONT_HERSHEY_SIMPLEX


def startapplication():
    # for camera use video = cv2.VideoCapture(0)
    video = cv2.VideoCapture("./RoadAccidents/RoadAccidents002_x264.mp4")

    while True:
        ret, frame = video.read()
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        roi = cv2.resize(gray_frame, (250, 250))

        pred, prob = model.predict_accident(roi[np.newaxis, :, :])
        if pred == "Accident":
            prob = round(prob[0][0] * 100, 2)

            cv2.rectangle(frame, (0, 0), (280, 40), (0, 0, 0), -1)
            cv2.putText(
                frame, pred + " " + str(prob), (20, 30), font, 1, (255, 255, 0), 2
            )

        if cv2.waitKey(33) & 0xFF == ord("q"):
            return
        cv2.imshow("Video", frame)


if __name__ == "__main__":
    startapplication()
