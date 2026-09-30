import Shared
import SwiftUI

@main
struct iOSApp: App {
    // One SDK instance for the whole app. The iOS simulator shares
    // the Mac's network, so "localhost" reaches the local API.
    private let sdk = MyChatSdk(apiBaseUrl: "http://localhost:4000")

    var body: some Scene {
        WindowGroup {
            ServerStatusView(checker: sdk.serverStatus)
        }
    }
}
