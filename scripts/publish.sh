#!/usr/bin/env bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

#comment=$(git log -1 --pretty=%B)
last_tag=$(git describe --abbrev=0)

comment="[patch] Testing patch change"
current_version="${last_tag//./ }"
version_array=($current_version)
change_type="None"

major=${version_array[0]}
minor=${version_array[1]}
patch=${version_array[2]}

path_regex='^\[patch\]';
minor_regex='^\[minor\]';
major_regex='^\[major\]';
version_change=0
if [[ $comment =~ $path_regex ]]
then
  change_type="patch"
  version_change=1
  patch=$((patch+1))

elif [[ $comment =~ $minor_regex ]]
then
  change_type="minor"
  version_change=1
  minor=$((minor+1));

elif [[ $comment =~ $major_regex ]]
then
  change_type="major"
  version_change=1
  major=$((major+1))
fi

new_version="${major}.${minor}.${patch}"

if [[ ${version_change} == 1 ]]
then
  # Update package.json
  echo "Updating package.json"
  sed -i 's/${current_version}/${new_version}/g' package.json
  git commit -am "${change_type} update to ${new_version}"
  git push origin master
fi