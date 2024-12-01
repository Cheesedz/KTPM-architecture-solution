from locust import HttpUser, task, between
import os
import random

class UploadRandomImageUser(HttpUser):
    wait_time = between(1, 5)

    image_folder = "../data"

    @task
    def upload_random_image(self):
        image_files = [
            f for f in os.listdir(self.image_folder)
            if os.path.isfile(os.path.join(self.image_folder, f))
        ]

        if not image_files:
            print(f"No images found in folder: {self.image_folder}")
            return

        random_image = random.choice(image_files)
        image_path = os.path.join(self.image_folder, random_image)

        with open(image_path, "rb") as image_file:
            files = {"files": (random_image, image_file, "image/png")}
            response = self.client.post("/upload", files=files)

            print(f"Uploaded {random_image}: Response {response.status_code}")
            if response.status_code != 200:
                print(f"Response content: {response.text}")
