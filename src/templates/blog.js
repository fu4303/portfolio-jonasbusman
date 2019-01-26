import React from "react";
import PropTypes from "prop-types";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import { BlogPostTemplate } from "../templates/blog-post";
import { HTMLContent } from "../components/Content";

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;
    const { currentPage, numPages } = this.props.pageContext;
    const isFirst = currentPage === 1;
    const isLast = currentPage === numPages;
    const prevPage = currentPage - 1 === 1 ? "/" : `page/${currentPage - 1}`;
    const nextPage = `page/${currentPage + 1}`;

    return (
      <Layout>
        {posts.map(({ node: post }) => (
          <BlogPostTemplate
            key={post.id}
            id={post.id}
            contentComponent={HTMLContent}
            title={post.frontmatter.title}
            photos={post.frontmatter.photos}
            slug={post.fields.slug}
            content={post.html}
          />
        ))}
        <section className="section">
          <div className="container is-widescreen">
            <div className="columns is-mobile">
              <div className="column is-three-fifths is-offset-one-fifth">
                <nav className="level">
                  <div className="level-left">
                    {!isFirst && (
                      <div className="level-item">
                        <Link to={prevPage} rel="prev">
                          ← Newer posts
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="level-right">
                    {!isLast && (
                      <div className="level-item">
                        <Link to={nextPage} rel="next">
                          Older posts →
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array
    })
  })
};

export const pageQuery = graphql`
  query IndexQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
      limit: $limit
      skip: $skip
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
                sizes(maxWidth: 2000) {
                  ...GatsbyImageSharpSizes
                }
              }
            }
          }
        }
      }
    }
  }
`;