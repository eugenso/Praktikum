# Watson + Solr

This project contains a nodejs web server application that creates a web app using solr and Watson services.


## Preparation
We first need a folder "data/" where we store the preprocessed .txt documents. The file names should follow this format:
*NUMBER_clean.txt*. These files will be loaded by Solr.

Additionally, the "data/" folder needs a subfolder with JSON documents that contain the entities extracted by the Watson API. These documents reside in the subfolder "json/". For an easy mapping the file format is very similar to before: *NUMBER_clean.txt.json*. 

## Execution

### Solr Container

First, we need to start the Solr docker container. We name it "watson-solr". We also mount the current "data" folder to the Docker container.

``docker run --name watson-solr -d -p 8983:8983 -t -v `(pwd)`/data:/data solr``

We create a core and modify the schema:

``docker exec -it --user=solr watson-solr bin/solr create_core -c testcore``

``docker exec -it --user=solr watson-solr curl -X POST -H 'Content-Type: application/json' 
'http://localhost:8983/solr/testcore/schema' --data-binary '{ 
"replace-field": { 
    "name":"_text_", 
    "type":"text_general", 
    "multiValued":true, 
    "indexed":true, 
    "stored":true } 
}'``

Now, we can index the data:

``docker exec -it --user=solr watson-solr java -Dc=testcore -Dauto=yes -Ddata=files -Drecursive=no -jar example/exampledocs/post.jar  /data  ``

In the last step, we make a final update to the schema:

``docker exec -it --user=solr watson-solr curl -X POST -H 'Content-Type: application/json' 'http://localhost:8983/solr/testcore/schema' --data-binary '{"delete-copy-field":{ "source":"*", "dest":"_text_" }}'
``

### Webapp container

To build the webapp container, we need the Dockerfile from this project: https://github.com/eugenso/Praktikum/blob/master/Dockerfile

Save this file into the project folder which contains the "data" folder.

Now, execute the Docker creation. This can take some time, as it downloads images and this GitHub project 

``docker build  -t watson-demo .``

Once the creation is complete, we can run the container. It is connecting to the "watson-solr" docker, this needs to be running.

``docker run -d --name watson-demo --link watson-solr:solr -p 8888:8888 -v `(pwd)`/data/:/home/app/data -w /home/app watson-demo npm start``


Now, you can access the web application on your machine with a web brower: *http://localhost:8888/*


## Opening and closing

Once the cointainers are installed on th system, you can start and stop them when required.

### Starting

``docker start watson-solr``

``docker start watson-demo ``

### Stopping
``docker stop watson-demo``

``docker stop watson-solr ``
