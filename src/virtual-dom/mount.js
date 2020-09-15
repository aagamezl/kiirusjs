export const mount = ($node, $target) => {
  // $target.replaceWith($node)
  if ($target.firstChild === null) {
    $target.appendChild($node)
  } else {
    $target.replaceChild($node, $target.firstChild)
  }

  return $node
}
