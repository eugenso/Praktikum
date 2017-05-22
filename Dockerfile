FROM node
EXPOSE 8888

RUN apt-get update && apt-get install -y git 

RUN adduser --disabled-password --gecos "" app
RUN adduser app app
RUN su app

ENV HOME=/home/app

RUN mkdir -p $HOME \
&& mkdir -p $HOME/.config
RUN chown -R app:app $HOME

RUN cd $HOME
RUN pwd
RUN echo $HOME
RUN ls $HOME

RUN git clone https://github.com/eugenso/Praktikum.git


RUN cp -r Praktikum/* $HOME/
RUN rm -r /Praktikum


RUN npm install


CMD ["npm", "start"]
