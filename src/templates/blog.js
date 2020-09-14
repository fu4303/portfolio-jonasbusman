import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import { Textfit } from 'react-textfit'
import FontFaceObserver from 'fontfaceobserver'

export default class IndexPage extends React.Component {
  componentDidMount() {
    let font = new FontFaceObserver('Inter')
    font.load().then(function() {
      window.dispatchEvent(new Event('resize'))
    })
  }
  render() {
    const {
      data,
      pageContext: { tag },
    } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <Layout>
        <section className="section is-medium">
          <div className="container is-fluid">
            {tag != null && (
              <h1 className="title is-size-2 is-centered has-text-centered">
                #{tag}
              </h1>
            )}
            <div className="post-list tile is-ancestor">
              {posts.map(({ node: post }, index) => (
                <div className="tile is-parent is-4" key={index}>
                  <div className="tile is-child blog-post-tile">
                    <Link to={post.fields.slug.replace('/blog/', '/')}>
                      {post.frontmatter.photos != null &&
                        post.frontmatter.photos[0] != null && (
                          <Img
                            className="blog-post-tile-image"
                            fluid={
                              post.frontmatter.photos[0].childImageSharp.fluid
                            }
                          />
                        )}
                      <h2>
                        <Textfit
                          max={300}
                          mode={
                            post.frontmatter.title.length > 12
                              ? 'multi'
                              : 'single'
                          }
                        >
                          {post.frontmatter.title}
                        </Textfit>
                      </h2>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query IndexQuery($tag: String) {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: {
        frontmatter: { templateKey: { eq: "blog-post" }, tags: { eq: $tag } }
      }
    ) {
      edges {
        node {
          id
          html
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            photos {
              childImageSharp {
                fluid(srcSetBreakpoints: [400, 800, 1000, 2000, 2500, 3000]) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
