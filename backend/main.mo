import Float "mo:base/Float";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Nat "mo:base/Nat";

actor Calculator {
  type CalculationResult = {
    operation: Text;
    result: Float;
  };

  stable var history : [CalculationResult] = [];

  public func calculate(op: Text, x: Float, y: Float) : async Result.Result<Float, Text> {
    let result = switch (op) {
      case ("+") { #ok(x + y) };
      case ("-") { #ok(x - y) };
      case ("*") { #ok(x * y) };
      case ("/") {
        if (y == 0) { #err("Division by zero") }
        else { #ok(x / y) }
      };
      case (_) { #err("Invalid operation") };
    };

    switch (result) {
      case (#ok(value)) {
        let calculation : CalculationResult = {
          operation = op # " " # Float.toText(x) # " " # op # " " # Float.toText(y);
          result = value;
        };
        history := Array.append(history, [calculation]);
      };
      case (_) {};
    };

    result
  };

  public query func getHistory() : async [CalculationResult] {
    history
  };

  public func sendEmail(to: Text, subject: Text, body: Text) : async Result.Result<Text, Text> {
    // Note: This is a mock implementation as the IC doesn't have a built-in email sending capability
    // In a real-world scenario, you would integrate with an external email service
    if (Text.size(to) > 0 and Text.size(subject) > 0 and Text.size(body) > 0) {
      #ok("Email sent successfully")
    } else {
      #err("Invalid email parameters")
    }
  };
}
