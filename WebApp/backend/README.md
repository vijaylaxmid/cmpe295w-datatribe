mkdir backend
cd backend
python3 -m venv python_modules          # create python environment
source ./python_modules/bin/activate    # activate python environment
pip install flask flask-cors     		# install essitial modules
python -m pip freeze > package.txt		# save dependencies to package.txt
deactivate                              # deactivate python environment