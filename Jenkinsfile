#!groovy
//  groovy Jenkinsfile
properties([disableConcurrentBuilds()])

pipeline  {
    
    agent { 
        label 'master'
        }
    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
        timestamps()
    }
    stages {
        stage("Removing old images") {
            steps {
                echo 'Removing images ...'
                dir('/home/master'){
                    sh "docker rmi macnaer/compass_frontend -f"
                }
            }
        }
        stage("Creating images") {
            steps {
                echo 'Creating docker image ...'
                dir('/home/master'){
                    sh "docker build -t macnaer/compass_frontend ."
                }
            }
        }
        stage("docker login") {
            steps {
                echo " ============== docker login =================="
                withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh '''
                    docker login -u $USERNAME -p $PASSWORD
                    '''
                }
            }
        }
        stage("docker push image") {
            steps {
                echo " ============== pushing image =================="
                sh '''
                docker push macnaer/compass_frontend:latest
                '''
            }
        }
        
        stage("docker run") {
            steps {
                echo " ============== starting frontend =================="
                sh '''
                docker run -d --restart=always --name compass_frontend -p 80:3000 macnaer/compass_frontend:latest
                '''
            }
        }
    }
}
