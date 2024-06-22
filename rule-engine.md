# Rule Engine Documentation

## Introduction

The rule engine language is designed for classifying bank transactions based on specific conditions. This language allows the definition of rules that evaluate conditions and execute corresponding actions if the conditions are met. The language is implemented in a Google Sheet, where each rule consists of a condition and actions to be executed.

## Syntax

### Rule Structure

A rule in the language consists of a condition followed by a question mark (`?`), a true action, and optionally a colon (`:`) followed by a false action. The false action is optional.

```
<condition> ? <true_action> [ : <false_action> ]
```

### Condition

Conditions can be either a comparison expression or a string containment check.

1. **Comparison Expression:**
    ```
    <operand> <operator> <operand>
    ```
    - `<operand>`: Can be a number or an identifier (e.g., `amount`).
    - `<operator>`: Can be `>`, `<`, or `=`.

2. **String Containment Check:**
    ```
    <identifier> contains <string>
    ```
    - `<identifier>`: Represents a field in the transaction (e.g., `description`).
    - `<string>`: A string literal enclosed in single quotes.

### Actions

Actions assign a value to an identifier.

```
<identifier> = <value>
```
- `<identifier>`: Represents a field to be set (e.g., `category`).
- `<value>`: Can be a string literal enclosed in single quotes or a number.

## Examples

### Example 1: Simple Comparison Rule
```plaintext
amount > 100 ? category = 'High'
```
If the `amount` is greater than 100, set the `category` to `'High'`.

### Example 2: Contains Rule with Else Condition
```plaintext
description contains 'groceries' ? category = 'Groceries' : category = 'Other'
```
If the `description` contains the word `'groceries'`, set the `category` to `'Groceries'`, otherwise set it to `'Other'`.

### Example 3: Simple Contains Rule
```plaintext
description contains 'electricity' ? category = 'Utilities'
```
If the `description` contains the word `'electricity'`, set the `category` to `'Utilities'`.

## Usage

### Writing Rules

1. **In Google Sheets:**
    - Create a Google Sheet with columns: Order, Condition, True Action, False Action.
    - Each row represents a rule.
    - The `Order` column determines the execution order of the rules.
    - The `Condition` column specifies the condition to evaluate.
    - The `True Action` column specifies the action to execute if the condition is true.
    - The `False Action` column specifies the action to execute if the condition is false (optional).

### Running the Rule Engine

1. **Define Transaction Context:**
    - Each transaction should be represented as a context object with fields like `amount` and `description`.

2. **Evaluate Rules:**
    - For each transaction, evaluate each rule in the specified order.
    - Apply the true or false action based on the evaluation of the condition.

## Limitations

- **Static Conditions and Actions:**
  - Conditions and actions are static and predefined. Dynamic or computed conditions/actions are not supported.

- **Limited Operators:**
  - Only basic comparison operators (`>`, `<`, `=`) and string containment (`contains`) are supported.

- **Single Rule Execution:**
  - Each rule evaluates and executes independently. There is no support for compound conditions or nested rules.

- **Field Names:**
  - Identifiers used in conditions and actions must correspond to predefined fields in the transaction context (e.g., `amount`, `description`).

## Conclusion

The rule engine language provides a straightforward way to classify bank transactions based on simple conditions and actions. It is designed to be used within a Google Sheet, allowing users to define and execute rules in a tabular format. While it has some limitations in terms of dynamic behavior and supported operations, it offers a clear and easy-to-understand syntax for basic transaction classification tasks.

---
