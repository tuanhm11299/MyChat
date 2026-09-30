import Shared
import SwiftUI

/// Shows whether the backend is reachable. The logic lives in the shared
/// Kotlin `ServerStatusChecker`; this view only renders its result.
struct ServerStatusView: View {
    let checker: ServerStatusChecker

    @State private var status: ServerStatus?
    @State private var attempt = 0

    var body: some View {
        VStack(spacing: 16) {
            Text("MyChat").font(.largeTitle).bold()
            Text("Running on \(PlatformKt.platformName())")
            Text(statusText)
            Button("Check again") { attempt += 1 }
        }
        .padding(24)
        // Runs when the view appears and again every time `attempt` changes.
        // Kotlin `suspend` functions are called from Swift with `try await`.
        .task(id: attempt) {
            status = nil
            status = try? await checker.check()
        }
    }

    private var statusText: String {
        switch status {
        case nil:
            return "Checking server…"
        case is ServerStatus.Online:
            return "Server is online ✅"
        case let offline as ServerStatus.Offline:
            return "Server is offline: \(offline.reason)"
        default:
            return "Unknown status"
        }
    }
}
