package com.movieplay

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String = "moviePlay"

    override fun onCreate(savedInstanceState: Bundle?) {
        SplashScreen.show(this)
        super.onCreate(savedInstanceState)
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        // Necesario para Google Sign-In
        if (requestCode == RC_SIGN_IN) {
            // Manejar el resultado de Google Sign-In aquí
        }
    }

    companion object {
        private const val RC_SIGN_IN = 9001
    }
}
