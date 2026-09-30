package com.mychat.android

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.mychat.shared.platformName
import com.mychat.shared.serverstatus.ServerStatus
import com.mychat.shared.serverstatus.ServerStatusChecker

/**
 * Shows whether the backend is reachable. The logic lives in the shared
 * ServerStatusChecker; this screen only renders its result.
 */
@Composable
fun ServerStatusScreen(checker: ServerStatusChecker) {
    var status by remember { mutableStateOf<ServerStatus?>(null) }
    var attempt by remember { mutableIntStateOf(0) }

    // Runs when the screen appears and again every time `attempt` changes.
    LaunchedEffect(attempt) {
        status = null
        status = checker.check()
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("MyChat", style = MaterialTheme.typography.headlineLarge)
        Text("Running on ${platformName()}")
        Text(
            when (val current = status) {
                null -> "Checking server…"
                ServerStatus.Online -> "Server is online ✅"
                is ServerStatus.Offline -> "Server is offline: ${current.reason}"
            },
        )
        Button(onClick = { attempt++ }) { Text("Check again") }
    }
}
