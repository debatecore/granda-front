import re

from src.main import insert_missing_lines, prepare_placeholder_from


def test_preparing_placeholders_basic():
    assert (
        prepare_placeholder_from('    "msg_handle_empty": "Handle must not be empty.",')
        == '    "msg_handle_empty": "[CHANGE ME!] Handle must not be empty.",'
    )


def test_preparing_placeholders_with_curly_braces():
    assert (
        prepare_placeholder_from('          "error_message": "Details: {message}"')
        == '          "error_message": "[CHANGE ME!] Details: {message}"'
    )


def test_instert_lines_right_to_left():
    diff_file = [
        '  "debate_details": {						  "debate_details": {',
        '    "unconfigured_debate": "Debata bez tezy"		      |	    "unconfigured_debate": "Debate without a motion",',
        '							      >	    "proceed_to_debate": "Proceed to Debate!",',
        '							      >	    "marshal_panel": "Marshal Panel"',
        "							      >	  },",
        '							      >	  "create_tournament": {',
        '							      >	    "title": "Create Tournament",',
        '							      >	    "full_name": "Full name",',
    ]

    file1 = [
        '  "debate_details": {',
        '    "unconfigured_debate": "Debata bez tezy"',
        "  }",
        "}",
    ]
    file2 = [
        '  "debate_details": {',
        '    "unconfigured_debate": "Debate without a motion",',
        '    "proceed_to_debate": "Proceed to Debate!",',
        '    "marshal_panel": "Marshal Panel"',
        "  },",
        '  "create_tournament": {',
        '    "title": "Create Tournament",',
        '    "full_name": "Full name",',
        '    "short_name": "Short name",',
        '    "close": "Close",',
        '    "full_name_placeholder": "(Required)"',
        "  },",
    ]

    file1, file2 = insert_missing_lines(file1, file2, diff_file)

    empty_value_pattern = r'(\s*".+":\s*"".*)'

    value_to_change_pattern = r'(\s*".+":\s*"\[CHANGE ME!\].+".*)'
    for line in file1:
        if not re.findall(r"debate|{|}", line):
            assert re.match(value_to_change_pattern, line)


def test_insert_lines_left_to_right():
    diff_file = [
        '        "metadata": {							  "metadata": {',
        '          "title": "granda: Debate Tournament Planner",	      |	    "title": "granda: Zaplanuj swój turniej debat",',
        '          "description": "Computer aided debate tournament organizi |	    "description": "Komputerowo wspomagane planowanie turniej',
        "        },							      <",
        '        "generic": {						      <',
        '          "error": "Error",					      <',
        '          "error_loading_content": "An error occurred while loading <',
        '          "error_message": "Details: {message}"		      <',
        "        },								  },",
    ]
    file1 = [
        '        "metadata": {',
        '          "title": "granda: Debate Tournament Planner",',
        '          "description": "Computer aided debate tournament organizing experience enrichment."',
        "        },",
        '        "generic": {',
        '          "error": "Error",',
        '          "error_loading_content": "An error occurred while loading the content.",',
        '          "error_message": "Details: {message}"',
        "        },",
    ]
    file2 = [
        '  "metadata": {',
        '    "title": "granda: Zaplanuj swój turniej debat",',
        '    "description": "Komputerowo wspomagane planowanie turniejów debat."',
        "  },",
    ]

    file1, file2 = insert_missing_lines(file1, file2, diff_file)

    value_to_change_pattern = r'(\s*".+":\s*"\[CHANGE ME!\].+".*)'
    for line in file2:
        if line.__contains__("error"):
            assert re.match(value_to_change_pattern, line)
