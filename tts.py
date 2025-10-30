import argparse
import os
import platform
import subprocess
import sys
from typing import Optional

import gTTS

tts = gTTS("Hello this is a normal text and i am a python package. lol")
tts.save("speech.mp3")
tts = gTTS("Bonjour, ceci est un texte normal et je suis un paquet python. lol", lang='fr')
tts.save("speech.mp3")

tts = gTTS("Hello this is a normal text and i am a python package. lol", slow=True)
tts.save("speech.mp3")

tts = gTTS("Hello this is a normal text and i am a python package. lol")
tts.save("speech.mp3")