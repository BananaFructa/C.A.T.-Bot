import tensorflow as tf
import keras as kr
import numpy as np
import matplotlib.image as mplimg

CatGenerator = kr.models.load_model("./SavedAIs/CatGenerator")

print("AI Python Backend Initilized")

def RunOne(ID):
    if (ID == "0"):
         mplimg.imsave("./AI/OUT.jpg",tf.reshape(CatGenerator(np.random.randn(1,100)),(64,64,3)).numpy())

while True:
    try:
        RunOne(input())
        print("EXEC_SUCCEDED")
    except Exception as Err:
        pass