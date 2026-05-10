#!/usr/bin/env python3
import json
import re
import subprocess
import sys
from pathlib import Path

SEMVER_RE = re.compile(
    r"^(0|[1-9]\d*)\."
    r"(0|[1-9]\d*)\."
    r"(0|[1-9]\d*)"
    r"(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?"
    r"(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$"
)

VERSION_FILES = ["package.json", "package-lock.json"]


def git_show(ref: str, path: str):
    try:
        return subprocess.check_output(
            ["git", "show", f"{ref}:{path}"],
            text=True,
            stderr=subprocess.DEVNULL,
        )
    except subprocess.CalledProcessError:
        return ""


def package_json_version(content: str):
    data = json.loads(content)

    if "version" in data:
        return data["version"]

    raise ValueError("Could not find version in package.json")


def package_lock_version(content: str):
    data = json.loads(content)

    root_version = data.get("version")
    package_version = data.get("packages", {}).get("", {}).get("version")

    if root_version and package_version and root_version != package_version:
        raise ValueError(
            "Version mismatch inside package-lock.json: "
            f"top-level version={root_version}, packages[''].version={package_version}"
        )

    if root_version:
        return root_version

    if package_version:
        return package_version

    raise ValueError("Could not find version in package-lock.json")


def extract_version(path: str, content: str):
    if path == "package.json":
        return package_json_version(content)

    if path == "package-lock.json":
        return package_lock_version(content)

    raise ValueError(f"Unsupported file: {path}")


def version_core(version: str) -> tuple[int, int, int]:
    match = SEMVER_RE.match(version)
    if not match:
        raise ValueError(f"{version!r} is not valid semantic versioning")

    return tuple(int(part) for part in match.groups()[:3])


def main():
    base_ref = sys.argv[1] if len(sys.argv) > 1 else "origin/master"

    current_versions = {}
    base_versions = {}

    for path in VERSION_FILES:
        current_content = Path(path).read_text()
        base_content = git_show(base_ref, path)

        if not base_content:
            print(f"::error::{path} does not exist in base ref {base_ref}")
            return 1

        current_versions[path] = extract_version(path, current_content)
        base_versions[path] = extract_version(path, base_content)

    package_current = current_versions["package.json"]
    lock_current = current_versions["package-lock.json"]

    if package_current != lock_current:
        print(
            "::error::Version numbers must match in package.json and package-lock.json. "
            f"Found package.json={package_current}, package-lock.json={lock_current}."
        )
        return 1

    if not SEMVER_RE.match(package_current):
        print(
            "::error::Version number must follow Semantic Versioning 2.0.0. "
            f"Found {package_current!r}."
        )
        return 1

    for path in VERSION_FILES:
        if current_versions[path] == base_versions[path]:
            print(
                "::error::A version number must be changed in package.json and "
                "package-lock.json for every merged PR. Please bump the version "
                "according to Semantic Versioning 2.0.0: "
                "https://semver.org/spec/v2.0.0.html"
            )
            return 1

    package_base = base_versions["package.json"]

    if version_core(package_current) <= version_core(package_base):
        print(
            "::error::Version must be increased according to Semantic Versioning "
            f"2.0.0. Base version is {package_base}, PR version is {package_current}."
        )
        return 1

    print(f"Version check passed: {package_base} -> {package_current}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())