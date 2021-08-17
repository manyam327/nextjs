pipeline{  
  environment {
    registry = "madhuri293/develop"
    registryCredential = 'DockerHub'
    dockerImage = ''
  }
  agent any
  tools {nodejs "node" }
  stages {
    stage('Cloning Git') {
      steps {
        git 'https://github.com/madhuri293/nextjs'
      }
    }
    stages {
        stage('Build'){
           steps{
              script{
                sh 'npm install'
              } 
           }   
        }
        stage('Building image') {
            steps{
                script {
                  dockerImage = docker.build registry + ":latest"
                 }
             }
          }
          stage('Push Image') {
              steps{
                  script {
                       docker.withRegistry( '', registryCredential){                            
                       dockerImage.push()
                      }
                   }
                } 
           }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $registry:$BUILD_NUMBER"
      }
    }
  }
}
}
