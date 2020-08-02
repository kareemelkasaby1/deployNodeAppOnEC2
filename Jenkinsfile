/* groovylint-disable-next-line CompileStatic */
pipeline {
    /* groovylint-disable-next-line NoDef, UnusedVariable, VariableName, VariableTypeRequired */
    agent any
    stages {
        stage('tests') {
            steps {
                /* groovylint-disable-next-line SpaceAroundMapEntryColon */
                parallel 'unit': {
                    /* groovylint-disable-next-line LineLength */
                    sh 'docker build -t kareemelkasaby/badreads-backend -f ./badreads-backend/Dockerfile.dev ./badreads-backend'
                    /* groovylint-disable-next-line LineLength */
                    sh 'docker build -t kareemelkasaby/badreads-frontend -f ./badreads-frontend/Dockerfile.dev ./badreads-backend'
                    sh 'docker run kareemelkasaby/badreads-backend npm run test'
                    sh 'docker run kareemelkasaby/badreads-frontend npm run test'
                },
                /* groovylint-disable-next-line SpaceAroundMapEntryColon */
                'integration': {
                    sh 'docker-compose -f ./docker-compose.yml.dev up --build --no-start'
                }
            }
        }

        stage('beforeDeploy') {
            steps {
                sh 'git rev-parse HEAD > /tmp/gitrev'
                /* groovylint-disable-next-line LineLength */
                sh 'SHA=$(cat /tmp/gitrev);docker build -t kareemelkasaby/badreads-backend:$SHA -t kareemelkasaby/badreads-backend:latest -f ./badreads-backend/Dockerfile.prod ./badreads-backend'
                /* groovylint-disable-next-line LineLength */
                sh 'SHA=$(cat /tmp/gitrev);docker build -t kareemelkasaby/badreads-frontend:$SHA -t kareemelkasaby/badreads-frontend:latest -f ./badreads-frontend/Dockerfile.prod ./badreads-frontend'
                /* groovylint-disable-next-line LineLength */
                sh 'SHA=$(cat /tmp/gitrev);docker build -t kareemelkasaby/nodenginx:$SHA -t kareemelkasaby/nodenginx:latest -f ./nginx/Dockerfile.prod ./nginx'
                sh "docker login -u '$DOCKERHUB_USER' -p '$DOCKERHUB_PASS'"
                sh 'SHA=$(cat /tmp/gitrev);docker push kareemelkasaby/badreads-backend:$SHA'
                sh 'docker push kareemelkasaby/badreads-backend:latest'
                sh 'SHA=$(cat /tmp/gitrev);docker push kareemelkasaby/badreads-frontend:$SHA'
                sh 'docker push kareemelkasaby/badreads-frontend:latest'
                sh 'SHA=$(cat /tmp/gitrev);docker push kareemelkasaby/nodenginx:$SHA'
                sh 'docker push kareemelkasaby/nodenginx:latest'
            }
        }
        stage('integrationTestAfterPush') {
            steps {
                sh 'docker-compose up --build --no-start --force-recreate'
            }
        }
        stage('deploy') {
            steps {
                /* groovylint-disable-next-line LineLength */
                sh "sudo ssh -o StrictHostKeyChecking=no -i $DEPLOYKEY ec2-user@$PRODEC2IP '[ -d '/home/ec2-user/app' ] && (cd ~/app;sudo docker-compose down);echo hi'"
                /* groovylint-disable-next-line LineLength */
                sh "sudo ssh -o StrictHostKeyChecking=no -i $DEPLOYKEY ec2-user@$PRODEC2IP '[ ! -d '/home/ec2-user/app' ] && mkdir -p ~/app/badreads-backend/public;echo hi'"
                /* groovylint-disable-next-line LineLength */
                sh "sudo rsync -rv --update -e 'ssh -o StrictHostKeyChecking=no -i $DEPLOYKEY' ./badreads-backend/public ec2-user@$PRODEC2IP:~/app/badreads-backend"
                /* groovylint-disable-next-line LineLength */
                sh "sudo scp -o StrictHostKeyChecking=no -i $DEPLOYKEY -p ./docker-compose.yml ec2-user@$PRODEC2IP:~/app"
                /* groovylint-disable-next-line LineLength */
                sh "sudo scp -o StrictHostKeyChecking=no -i $DEPLOYKEY -p ./badreads-backend/.env ec2-user@$PRODEC2IP:~/app/badreads-backend"
                /* groovylint-disable-next-line LineLength */
                sh "sudo scp -o StrictHostKeyChecking=no -i $DEPLOYKEY -p ./badreads-backend/package.json ec2-user@$PRODEC2IP:~/app/badreads-backend"
                /* groovylint-disable-next-line LineLength */
                sh "sudo scp -o StrictHostKeyChecking=no -i $DEPLOYKEY -p ./badreads-frontend/package.json ec2-user@$PRODEC2IP:~/app/badreads-backend"
                sh "sudo scp -o StrictHostKeyChecking=no -i $DEPLOYKEY -p ./init-mongo.js ec2-user@$PRODEC2IP:~/app"
                /* groovylint-disable-next-line LineLength */
                sh "sudo ssh -o StrictHostKeyChecking=no -i $DEPLOYKEY ec2-user@$PRODEC2IP 'cd ~/app;sudo docker-compose up --build -d;exit'"
            }
        }
    }
}
