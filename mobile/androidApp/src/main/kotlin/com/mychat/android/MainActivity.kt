package com.mychat.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val sdk = (application as MyChatApplication).sdk
        setContent {
            MaterialTheme {
                ServerStatusScreen(checker = sdk.serverStatus)
            }
        }
    }
}
