node('master') {
    currentBuild.result = "SUCCESS"

    try {
        stage 'Pull'		
            checkout scm

        stage 'Install'
            sh 'npm install'
            sh 'typings install'

        stage 'Compile'
            sh 'tsc -p .'

        stage 'Test'
            sh 'node server &'
            sh 'mocha test'

    } catch(err) {
        currentBuild.result = "FAILURE"

        throw err
    }
}